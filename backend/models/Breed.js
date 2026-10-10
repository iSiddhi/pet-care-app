const mongoose = require('mongoose');

const breedSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // Matches the petTypes used across the frontend
    petType: {
      type: String,
      required: true,
      enum: ['Dog', 'Cat', 'Rabbit', 'Birds', 'Fish', 'Turtle'],
      index: true,
    },
    description: { type: String, default: '' },
    averageLifespan: { type: String, default: '' },
    temperament: { type: [String], default: [] },
  },
  { timestamps: true }
);

breedSchema.index({ petType: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Breed', breedSchema);
