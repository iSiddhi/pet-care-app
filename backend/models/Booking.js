const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    groomer: { type: mongoose.Schema.Types.ObjectId, ref: 'Groomer', required: true },
    service: { type: String, required: true },
    petType: { type: String, required: true, enum: ['Dog', 'Cat', 'Rabbit', 'Birds', 'Fish', 'Turtle'] },
    petName: { type: String, default: '' },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    notes: { type: String, default: '' },
    price: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

// Stops the same groomer being double-booked for one slot
bookingSchema.index(
  { groomer: 1, date: 1, timeSlot: 1 },
  { unique: true, partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } } }
);

module.exports = mongoose.model('Booking', bookingSchema);
