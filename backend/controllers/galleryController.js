const asyncHandler = require('../middleware/asyncHandler');
const GalleryImage = require('../models/GalleryImage');

// @route  GET /api/gallery?category=Dog
// @access Public  -- api.js consumes a bare array
exports.getGallery = asyncHandler(async (req, res) => {
  const filter = req.query.category ? { category: req.query.category } : {};
  const images = await GalleryImage.find(filter).sort({ createdAt: -1 });
  res.json(images);
});

// @route  POST /api/gallery (admin)
exports.createGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.create(req.body);
  res.status(201).json({ success: true, image });
});

// @route  DELETE /api/gallery/:id (admin)
exports.deleteGalleryImage = asyncHandler(async (req, res) => {
  const image = await GalleryImage.findByIdAndDelete(req.params.id);
  if (!image) {
    res.status(404);
    throw new Error('Image not found');
  }
  res.json({ success: true, message: 'Image removed' });
});
