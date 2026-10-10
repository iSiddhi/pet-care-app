const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/breedController');

const router = express.Router();

router.route('/')
  .get(c.getBreeds)
  .post(protect, authorize('admin'), c.createBreed);

module.exports = router;
