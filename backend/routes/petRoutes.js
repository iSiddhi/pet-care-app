const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/petController');

const router = express.Router();

router.route('/')
  .get(c.getPets)
  .post(protect, authorize('admin'), c.createPet);

router.route('/:id')
  .get(c.getPetById)
  .put(protect, authorize('admin'), c.updatePet)
  .delete(protect, authorize('admin'), c.deletePet);

module.exports = router;
