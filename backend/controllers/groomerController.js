const asyncHandler = require('../middleware/asyncHandler');
const Groomer = require('../models/Groomer');

// @route  GET /api/groomers
// @access Public
// api.js consumes the array directly, so return a bare array.
exports.getGroomers = asyncHandler(async (req, res) => {
  const groomers = await Groomer.find({ active: true }).sort({ createdAt: 1 });
  res.json(groomers);
});

// @route  GET /api/groomers/:id
exports.getGroomerById = asyncHandler(async (req, res) => {
  const groomer = await Groomer.findById(req.params.id);
  if (!groomer) {
    res.status(404);
    throw new Error('Groomer not found');
  }
  res.json({ success: true, groomer });
});

// @route  POST /api/groomers (admin)
exports.createGroomer = asyncHandler(async (req, res) => {
  const groomer = await Groomer.create(req.body);
  res.status(201).json({ success: true, groomer });
});
