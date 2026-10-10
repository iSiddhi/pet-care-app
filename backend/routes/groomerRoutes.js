const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/groomerController');

const router = express.Router();

router.route('/')
  .get(c.getGroomers)
  .post(protect, authorize('admin'), c.createGroomer);

router.get('/:id', c.getGroomerById);

module.exports = router;
