const asyncHandler = require('../middleware/asyncHandler');
const Product = require('../models/Product');

// @route  GET /api/essentials?petType=Dog&category=Food
// @access Public
// Essentials.jsx groups by pet tab, so support both flat and grouped shapes.
exports.getProducts = asyncHandler(async (req, res) => {
  const { petType, category, grouped } = req.query;
  const filter = {};
  if (petType) filter.petType = petType;
  if (category) filter.category = category;

  const products = await Product.find(filter).sort({ petType: 1, name: 1 });

  if (grouped === 'true') {
    const byPet = products.reduce((acc, p) => {
      (acc[p.petType] ||= []).push(p);
      return acc;
    }, {});
    return res.json({ success: true, products: byPet });
  }

  res.json({ success: true, count: products.length, products });
});

// @route  GET /api/essentials/:id
exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

// @route  POST /api/essentials (admin)
exports.createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, product });
});

// @route  PUT /api/essentials/:id (admin)
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

// @route  DELETE /api/essentials/:id (admin)
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, message: 'Product removed' });
});
