const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/orderController');

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('shippingAddress.fullName').notEmpty().withMessage('Full name is required'),
    body('shippingAddress.line1').notEmpty().withMessage('Address is required'),
    body('shippingAddress.city').notEmpty().withMessage('City is required'),
    body('shippingAddress.postalCode').notEmpty().withMessage('Postal code is required'),
    body('shippingAddress.phone')
      .matches(/^[0-9+\-\s()]{10,15}$/)
      .withMessage('Please enter a valid phone number'),
  ],
  validate,
  c.createOrder
);

// Static paths before /:id so they aren't swallowed by the param route
router.get('/my', c.getMyOrders);
router.get('/pending-payments', authorize('admin'), c.getPendingPayments);
router.get('/', authorize('admin'), c.getAllOrders);

router.get('/:id', c.getOrderById);
router.get('/:id/payment', c.getPayment);
router.post('/:id/payment/utr', c.submitUtr);
router.patch('/:id/payment/verify', authorize('admin'), c.verifyPayment);
router.put('/:id/status', authorize('admin'), c.updateOrderStatus);

module.exports = router;
