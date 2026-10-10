const asyncHandler = require('../middleware/asyncHandler');
const Pet = require('../models/Pet');

// @route  GET /api/pets?type=Dog&breed=&minPrice=&maxPrice=&page=1&limit=20
// @access Public
// Frontend (PetServices.jsx) expects: { pets: [...] }
exports.getPets = asyncHandler(async (req, res) => {
  const { type, breed, minPrice, maxPrice, page = 1, limit = 20 } = req.query;

  const filter = { available: true };
  if (type) filter.type = type;
  if (breed) filter.breed = breed;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [pets, total] = await Promise.all([
    Pet.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    Pet.countDocuments(filter),
  ]);

  res.json({ success: true, count: pets.length, total, page: Number(page), pets });
});

// @route  GET /api/pets/:id
// @access Public
exports.getPetById = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id);
  if (!pet) {
    res.status(404);
    throw new Error('Pet not found');
  }
  res.json({ success: true, pet });
});

// @route  POST /api/pets      (admin)
exports.createPet = asyncHandler(async (req, res) => {
  const pet = await Pet.create(req.body);
  res.status(201).json({ success: true, pet });
});

// @route  PUT /api/pets/:id   (admin)
exports.updatePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!pet) {
    res.status(404);
    throw new Error('Pet not found');
  }
  res.json({ success: true, pet });
});

// @route  DELETE /api/pets/:id (admin)
exports.deletePet = asyncHandler(async (req, res) => {
  const pet = await Pet.findByIdAndDelete(req.params.id);
  if (!pet) {
    res.status(404);
    throw new Error('Pet not found');
  }
  res.json({ success: true, message: 'Pet removed' });
});
