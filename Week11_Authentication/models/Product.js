const mongoose = require("mongoose");

// Product Schema defines what a product looks like in the database
const productSchema = new mongoose.Schema({
  // Name of the product
  name: {
    type: String,
    required: true,
    unique: true
  },

  // Base price of the product (Tall size)
  price: {
    type: Number,
    required: true
  },

  // Description of the product
  description: {
    type: String
  },

  // Available sizes and their price adjustments
  sizes: [{
    name: {
      type: String,
      required: true
    },
    fluidOunces: {
      type: Number,
      required: true
    },
    priceAdjustment: {
      type: Number,
      required: true
    }
  }],

  // Reference to the user who created the product
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

// Export model
module.exports = mongoose.model("Product", productSchema);
