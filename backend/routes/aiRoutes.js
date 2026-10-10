const express = require('express');
const rateLimit = require('express-rate-limit');
const c = require('../controllers/aiController');

const router = express.Router();

// AI calls cost money -- keep a lid on them per IP
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please wait a minute.' },
});

router.post('/predict-disease', aiLimiter, c.predictDisease);
router.post('/chatbot', aiLimiter, c.chat);
router.get('/ai/status', c.aiStatus);

module.exports = router;
