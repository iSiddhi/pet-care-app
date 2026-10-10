const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    // Which pet tab this shows under on the Essentials page
    petType: {
      type: String,
      required: true,
      enum: ['Dog', 'Cat', 'Rabbit', 'Birds', 'Fish', 'Turtle'],
      index: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Food', 'Accessories', 'Toys', 'Comfort', 'Grooming', 'Health', 'Habitat', 'Hygiene', 'Furniture', 'Travel'],
    },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, default: '' },
    description: { type: String, default: '' },
    inStock: { type: Boolean, default: true },
    stockCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
