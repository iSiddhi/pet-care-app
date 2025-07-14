const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// @route   POST /api/contact
// @desc    Submit a new contact form
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    // Create new contact
    const contact = new Contact({
      name,
      email,
      phone,
      message
    });

    // Save to database
    await contact.save();

    res.status(201).json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      data: contact 
    });

  } catch (error) {
    console.error('Error submitting contact form:', error.message);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ 
        success: false, 
        error: messages.join(', ')
      });
    }

    res.status(500).json({ 
      success: false, 
      error: 'Server error processing your request'
    });
  }
});

module.exports = router;
