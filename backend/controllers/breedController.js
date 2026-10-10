const asyncHandler = require('../middleware/asyncHandler');
const Breed = require('../models/Breed');

// @route  GET /api/breeds?pet=Dog
// @access Public
// Frontend (PetFinder.jsx, PetServices.jsx) expects: { breeds: ["Labrador", ...] }
exports.getBreeds = asyncHandler(async (req, res) => {
  const { pet, detailed } = req.query;
  const filter = pet ? { petType: pet } : {};
  const docs = await Breed.find(filter).sort({ name: 1 });

  res.json({
    success: true,
    breeds: detailed === 'true' ? docs : docs.map((b) => b.name),
  });
});

// @route  POST /api/breeds (admin)
exports.createBreed = asyncHandler(async (req, res) => {
  const breed = await Breed.create(req.body);
  res.status(201).json({ success: true, breed });
});
