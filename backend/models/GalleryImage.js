const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    category: {
      type: String,
      enum: ['Dog', 'Cat', 'Rabbit', 'Birds', 'Fish', 'Turtle', 'Other'],
      default: 'Other',
      index: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
