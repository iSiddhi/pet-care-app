const asyncHandler = require('../middleware/asyncHandler');
const Booking = require('../models/Booking');
const Groomer = require('../models/Groomer');

const SLOTS = ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'];

// @route  GET /api/bookings/slots?groomer=<id>&date=2026-10-15
// @access Public -- lets the UI grey out taken slots before submitting
exports.getAvailableSlots = asyncHandler(async (req, res) => {
  const { groomer, date } = req.query;
  if (!groomer || !date) {
    res.status(400);
    throw new Error('groomer and date are both required');
  }

  const day = new Date(date);
  const nextDay = new Date(day.getTime() + 24 * 60 * 60 * 1000);

  const taken = await Booking.find({
    groomer,
    date: { $gte: day, $lt: nextDay },
    status: { $in: ['pending', 'confirmed'] },
  }).select('timeSlot');

  const takenSet = new Set(taken.map((b) => b.timeSlot));
  res.json({
    success: true,
    slots: SLOTS.map((s) => ({ time: s, available: !takenSet.has(s) })),
  });
});

// @route  POST /api/bookings
// @access Private
exports.createBooking = asyncHandler(async (req, res) => {
  const { groomer, service, petType, petName, date, timeSlot, notes, price } = req.body;

  if (!SLOTS.includes(timeSlot)) {
    res.status(400);
    throw new Error(`Invalid time slot. Pick one of: ${SLOTS.join(', ')}`);
  }
  if (new Date(date) < new Date(new Date().toDateString())) {
    res.status(400);
    throw new Error('Cannot book a date in the past');
  }
  if (!(await Groomer.findById(groomer))) {
    res.status(404);
    throw new Error('Groomer not found');
  }

  try {
    const booking = await Booking.create({
      user: req.user._id,
      groomer, service, petType, petName, date, timeSlot, notes, price,
    });
    res.status(201).json({ success: true, booking });
  } catch (err) {
    // Unique index on (groomer, date, timeSlot) rejects double-booking
    if (err.code === 11000) {
      res.status(409);
      throw new Error('That slot has just been booked. Please pick another time.');
    }
    throw err;
  }
});

// @route  GET /api/bookings/my
// @access Private
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('groomer', 'name avatar phone email')
    .sort({ date: -1 });
  res.json({ success: true, count: bookings.length, bookings });
});

// @route  PATCH /api/bookings/:id/cancel
// @access Private
exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }
  booking.status = 'cancelled';
  await booking.save();
  res.json({ success: true, booking });
});

// @route  GET /api/bookings (admin)
exports.getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find()
    .populate('user', 'name email')
    .populate('groomer', 'name')
    .sort({ date: -1 });
  res.json({ success: true, count: bookings.length, bookings });
});
