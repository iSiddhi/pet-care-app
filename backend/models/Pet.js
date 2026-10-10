const mongoose = require('mongoose');

const petSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['Dog', 'Cat', 'Rabbit', 'Birds', 'Fish', 'Turtle'],
      index: true,
    },
    breed: { type: String, required: true, trim: true },
    characteristics: { type: [String], default: [] },
    image: { type: String, default: '' },
    price: { type: Number, required: true, min: 0, index: true },
    age: { type: String, default: '' },
    description: { type: String, default: '' },
    available: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// Frontend expects pet.link for the detail page
petSchema.virtual('link').get(function link() {
  return `/pets/${this.type.toLowerCase()}/${this._id}`;
});

module.exports = mongoose.model('Pet', petSchema);
