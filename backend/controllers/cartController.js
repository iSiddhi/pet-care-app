const asyncHandler = require('../middleware/asyncHandler');
const User = require('../models/User');
const Product = require('../models/Product');

const loadCart = (userId) =>
  User.findById(userId).populate('cart.product');

const summarise = (user) => {
  // A product deleted after being added leaves a null ref; drop those.
  const items = user.cart.filter((i) => i.product);
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  return {
    items: items.map((i) => ({
      product: i.product,
      quantity: i.quantity,
      lineTotal: Number((i.product.price * i.quantity).toFixed(2)),
    })),
    itemCount: items.reduce((n, i) => n + i.quantity, 0),
    subtotal: Number(subtotal.toFixed(2)),
  };
};

// @route  GET /api/cart
// @access Private
exports.getCart = asyncHandler(async (req, res) => {
  const user = await loadCart(req.user._id);
  res.json({ success: true, cart: summarise(user) });
});

// @route  POST /api/cart   body: { productId, quantity }
// @access Private
exports.addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  if (!product.inStock) {
    res.status(400);
    throw new Error(`${product.name} is out of stock`);
  }

  const user = await User.findById(req.user._id);
  const existing = user.cart.find((i) => i.product.toString() === productId);
  if (existing) existing.quantity += Number(quantity);
  else user.cart.push({ product: productId, quantity: Number(quantity) });

  await user.save();
  res.status(201).json({ success: true, cart: summarise(await loadCart(req.user._id)) });
});

// @route  PUT /api/cart/:productId   body: { quantity }
// @access Private
exports.updateCartItem = asyncHandler(async (req, res) => {
  const quantity = Number(req.body.quantity);
  const user = await User.findById(req.user._id);
  const item = user.cart.find((i) => i.product.toString() === req.params.productId);

  if (!item) {
    res.status(404);
    throw new Error('Item not in cart');
  }

  if (quantity <= 0) {
    user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
  } else {
    item.quantity = quantity;
  }

  await user.save();
  res.json({ success: true, cart: summarise(await loadCart(req.user._id)) });
});

// @route  DELETE /api/cart/:productId
// @access Private
exports.removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((i) => i.product.toString() !== req.params.productId);
  await user.save();
  res.json({ success: true, cart: summarise(await loadCart(req.user._id)) });
});

// @route  DELETE /api/cart
// @access Private
exports.clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();
  res.json({ success: true, cart: { items: [], itemCount: 0, subtotal: 0 } });
});

// @route  POST /api/cart/merge   body: { items: [{ productId, quantity }] }
// @access Private
// Called right after login so a guest cart is never silently dropped.
// Quantities add together; unknown or deleted products are skipped.
exports.mergeCart = asyncHandler(async (req, res) => {
  const incoming = Array.isArray(req.body.items) ? req.body.items : [];

  if (incoming.length === 0) {
    return res.json({ success: true, merged: 0, cart: summarise(await loadCart(req.user._id)) });
  }

  const ids = incoming.map((i) => i.productId).filter(Boolean);
  const found = await Product.find({ _id: { $in: ids } }).select('_id inStock');
  const sellable = new Set(
    found.filter((p) => p.inStock).map((p) => p._id.toString())
  );

  const user = await User.findById(req.user._id);
  let merged = 0;

  for (const { productId, quantity = 1 } of incoming) {
    if (!sellable.has(String(productId))) continue;

    const qty = Math.max(1, Number(quantity) || 1);
    const existing = user.cart.find((i) => i.product.toString() === String(productId));
    if (existing) existing.quantity += qty;
    else user.cart.push({ product: productId, quantity: qty });
    merged += 1;
  }

  await user.save();
  res.json({ success: true, merged, cart: summarise(await loadCart(req.user._id)) });
});
