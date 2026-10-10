const express = require('express');
const { protect } = require('../middleware/auth');
const c = require('../controllers/cartController');

const router = express.Router();

// Every cart route needs a logged-in user
router.use(protect);

router.route('/')
  .get(c.getCart)
  .post(c.addToCart)
  .delete(c.clearCart);

router.post('/merge', c.mergeCart);

router.route('/:productId')
  .put(c.updateCartItem)
  .delete(c.removeFromCart);

module.exports = router;
