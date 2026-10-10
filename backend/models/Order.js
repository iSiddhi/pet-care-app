const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: { type: [orderItemSchema], validate: [(v) => v.length > 0, 'Order must have at least one item'] },
    shippingAddress: {
      fullName: { type: String, required: true },
      line1: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' },
      phone: { type: String, required: true },
    },
    itemsPrice: { type: Number, required: true, min: 0 },
    shippingPrice: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: ['UPI'], default: 'UPI' },

    // UPI has no callback, so payment moves through states a human closes.
    //   awaiting  -> QR shown, nothing received yet
    //   submitted -> customer entered a UTR, waiting on verification
    //   verified  -> an admin confirmed the money arrived
    //   failed    -> admin rejected it, or it expired unpaid
    payment: {
      status: {
        type: String,
        enum: ['awaiting', 'submitted', 'verified', 'failed'],
        default: 'awaiting',
        index: true,
      },
      txnRef: { type: String, required: true, unique: true },
      vpa: { type: String, required: true },
      amountINR: { type: Number, required: true, min: 0 },
      utr: { type: String, default: '' },
      submittedAt: Date,
      verifiedAt: Date,
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      failureReason: { type: String, default: '' },
    },

    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    status: {
      type: String,
      enum: ['awaiting_payment', 'placed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'awaiting_payment',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
