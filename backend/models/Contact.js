const mongoose = require('mongoose');

// Mirrors the validation already enforced in frontend Contact.jsx
const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true, maxlength: 80 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^[0-9+\-\s()]{10,15}$/, 'Please enter a valid phone number'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters'],
      maxlength: 2000,
    },
    handled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Contact', contactSchema);
