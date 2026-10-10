const asyncHandler = require('../middleware/asyncHandler');
const Order = require('../models/Order');
const User = require('../models/User');
const upi = require('../utils/upi');

const SHIPPING_FLAT = 4.99;
const FREE_SHIPPING_OVER = 75;

/** Everything the payment screen needs, in one shape. */
const paymentPayload = async (order) => {
  const uri = upi.buildUpiUri({
    amountINR: order.payment.amountINR,
    txnRef: order.payment.txnRef,
    note: `Order ${String(order._id).slice(-8).toUpperCase()}`,
  });

  return {
    status: order.payment.status,
    txnRef: order.payment.txnRef,
    vpa: order.payment.vpa,
    payeeName: upi.config().name,
    amountUSD: order.totalPrice,
    amountINR: order.payment.amountINR,
    utr: order.payment.utr,
    failureReason: order.payment.failureReason,
    createdAt: order.createdAt,
    expired: order.payment.status === 'awaiting' && upi.isExpired(order.createdAt),
    expiresInMs: Math.max(
      0,
      upi.PAYMENT_WINDOW_MS - (Date.now() - new Date(order.createdAt).getTime())
    ),
    upiUri: uri,
    qrDataUrl: await upi.buildQrDataUrl(uri),
  };
};

// @route  POST /api/orders
// @access Private
// Creates the order in `awaiting_payment` and hands back the UPI QR.
// Prices come from the DB; nothing the client sends is trusted.
exports.createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress } = req.body;

  if (!upi.isConfigured()) {
    res.status(503);
    throw new Error('Payments are not configured yet. Set MERCHANT_VPA in the server .env.');
  }

  const user = await User.findById(req.user._id).populate('cart.product');
  const validItems = user.cart.filter((i) => i.product);

  if (validItems.length === 0) {
    res.status(400);
    throw new Error('Your cart is empty');
  }

  const outOfStock = validItems.filter((i) => !i.product.inStock);
  if (outOfStock.length) {
    res.status(400);
    throw new Error(`Out of stock: ${outOfStock.map((i) => i.product.name).join(', ')}`);
  }

  const items = validItems.map((i) => ({
    product: i.product._id,
    name: i.product.name,
    image: i.product.image,
    price: i.product.price,
    quantity: i.quantity,
  }));

  const itemsPrice = Number(items.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2));
  const shippingPrice = itemsPrice >= FREE_SHIPPING_OVER ? 0 : SHIPPING_FLAT;
  const totalPrice = Number((itemsPrice + shippingPrice).toFixed(2));

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod: 'UPI',
    itemsPrice,
    shippingPrice,
    totalPrice,
    status: 'awaiting_payment',
    payment: {
      status: 'awaiting',
      txnRef: upi.makeTxnRef(),
      vpa: upi.config().vpa,
      amountINR: upi.toINR(totalPrice),
    },
  });

  // Cart is only emptied once payment is verified, so a abandoned
  // checkout doesn't lose the customer's basket.
  res.status(201).json({ success: true, order, payment: await paymentPayload(order) });
});

// @route  GET /api/orders/:id/payment
// @access Private (owner or admin)
// Polled by the payment screen.
exports.getPayment = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this payment');
  }

  // Lazily mark stale unpaid orders rather than running a cron
  if (order.payment.status === 'awaiting' && upi.isExpired(order.createdAt)) {
    order.payment.status = 'failed';
    order.payment.failureReason = 'Payment window expired';
    order.status = 'cancelled';
    await order.save();
  }

  res.json({ success: true, payment: await paymentPayload(order), orderStatus: order.status });
});

// @route  POST /api/orders/:id/payment/utr   body: { utr }
// @access Private (owner)
exports.submitUtr = asyncHandler(async (req, res) => {
  const utr = String(req.body.utr || '').trim();

  if (!upi.isValidUtr(utr)) {
    res.status(400);
    throw new Error('A UPI reference number is exactly 12 digits. Check your payment app.');
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }
  if (['verified', 'submitted'].includes(order.payment.status)) {
    res.status(409);
    throw new Error('This payment has already been submitted');
  }

  // The same UTR cannot be reused across orders
  const duplicate = await Order.findOne({ 'payment.utr': utr, _id: { $ne: order._id } });
  if (duplicate) {
    res.status(409);
    throw new Error('That reference number is already on another order');
  }

  order.payment.utr = utr;
  order.payment.status = 'submitted';
  order.payment.submittedAt = new Date();
  order.payment.failureReason = '';
  order.status = 'placed';
  await order.save();

  res.json({ success: true, payment: await paymentPayload(order) });
});

// @route  PATCH /api/orders/:id/payment/verify   body: { approve, reason? }
// @access Admin
exports.verifyPayment = asyncHandler(async (req, res) => {
  const { approve, reason } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (approve) {
    order.payment.status = 'verified';
    order.payment.verifiedAt = new Date();
    order.payment.verifiedBy = req.user._id;
    order.payment.failureReason = '';
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'processing';

    // Money is in -- now it is safe to empty the buyer's cart
    await User.findByIdAndUpdate(order.user, { $set: { cart: [] } });
  } else {
    order.payment.status = 'failed';
    order.payment.failureReason = reason || 'Payment could not be verified';
    order.status = 'cancelled';
  }

  await order.save();
  res.json({ success: true, order });
});

// @route  GET /api/orders/pending-payments
// @access Admin
exports.getPendingPayments = asyncHandler(async (req, res) => {
  const orders = await Order.find({ 'payment.status': 'submitted' })
    .populate('user', 'name email phone')
    .sort({ 'payment.submittedAt': 1 });
  res.json({ success: true, count: orders.length, orders });
});

// @route  GET /api/orders/my
// @access Private
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

// @route  GET /api/orders/:id
// @access Private (owner or admin)
exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }
  res.json({ success: true, order });
});

// @route  GET /api/orders
// @access Admin
exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, count: orders.length, orders });
});

// @route  PUT /api/orders/:id/status
// @access Admin
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  order.status = req.body.status ?? order.status;
  await order.save();
  res.json({ success: true, order });
});
