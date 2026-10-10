const mongoose = require('mongoose');

const groomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    avatar: { type: String, default: '' },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    specialties: { type: [String], default: [] },
    experienceYears: { type: Number, default: 0 },
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Groomer', groomerSchema);
