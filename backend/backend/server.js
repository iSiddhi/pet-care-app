const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const Contact = require('./models/Contact.js');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// POST route to handle contact form submissions
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const contact = new Contact({ name, email, phone, message });
    await contact.save();

    res.status(200).json({ message: 'Message saved successfully!' });
  } catch (error) {
    console.error('Error saving contact:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


mongoose.connect(process.env.MONGODB_URI)

  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });
