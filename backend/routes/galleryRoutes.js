const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/galleryController');

const router = express.Router();

router.route('/')
  .get(c.getGallery)
  .post(protect, authorize('admin'), c.createGalleryImage);

router.delete('/:id', protect, authorize('admin'), c.deleteGalleryImage);

module.exports = router;
