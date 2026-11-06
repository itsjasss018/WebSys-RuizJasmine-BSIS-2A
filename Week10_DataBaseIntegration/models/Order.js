const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  // Reference to user who made the order
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  // Order type
  orderType: {
    type: String,
    required: true
  },

  // Array of products in the order
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    size: {
      type: String,
      required: true
    },
    fluidOunces: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    }
  }],

  // Total price
  totalAmount: {
    type: Number,
    required: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
