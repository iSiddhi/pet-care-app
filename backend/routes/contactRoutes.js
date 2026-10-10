const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/contactController');

const router = express.Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('phone').matches(/^[0-9+\-\s()]{10,15}$/).withMessage('Please enter a valid phone number'),
    body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  ],
  validate,
  c.submitContact
);

router.get('/', protect, authorize('admin'), c.getContacts);
router.patch('/:id', protect, authorize('admin'), c.markHandled);

module.exports = router;
