const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/productController');

const router = express.Router();

router.route('/')
  .get(c.getProducts)
  .post(protect, authorize('admin'), c.createProduct);

router.route('/:id')
  .get(c.getProductById)
  .put(protect, authorize('admin'), c.updateProduct)
  .delete(protect, authorize('admin'), c.deleteProduct);

module.exports = router;
