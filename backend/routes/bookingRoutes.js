const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/bookingController');

const router = express.Router();

// Public: lets the UI show free slots before login
router.get('/slots', c.getAvailableSlots);

router.use(protect);

router.post(
  '/',
  [
    body('groomer').notEmpty().withMessage('Groomer is required'),
    body('service').notEmpty().withMessage('Service is required'),
    body('petType').notEmpty().withMessage('Pet type is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('timeSlot').notEmpty().withMessage('Time slot is required'),
  ],
  validate,
  c.createBooking
);

router.get('/my', c.getMyBookings);
router.get('/', authorize('admin'), c.getAllBookings);
router.patch('/:id/cancel', c.cancelBooking);

module.exports = router;
