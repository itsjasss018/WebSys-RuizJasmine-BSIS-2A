const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected");

    // Find an existing user or create a sample user
    let user = await User.findOne();

    if (!user) {
      user = await User.create({
        name: "Sample Customer",
        email: "sample@example.com",
        flavor: "Classic Matcha",
        size: "Short",
        quantity: 1,
        orderType: "To go",
        unitPrice: 229,
        totalPrice: 229
      });

      console.log("Sample user created");
    }

    // Find the Classic Matcha product
    const product = await Product.findOne({
      name: "Classic Matcha"
    });

    if (!product) {
      throw new Error(
        "Classic Matcha not found. Check your products first."
      );
    }

    // Create a sample order only if no orders exist
    const existingOrder = await Order.findOne();

    if (!existingOrder) {
      const shortSize = product.sizes.find(
        size => size.name === "Short"
      );

      if (!shortSize) {
        throw new Error("Short size not found.");
      }

      const unitPrice = product.price + shortSize.priceAdjustment;

      await Order.create({
        user: user._id,
        products: [{
          product: product._id,
          size: shortSize.name,
          fluidOunces: shortSize.fluidOunces,
          quantity: 1,
          price: unitPrice
        }],
        totalAmount: unitPrice
      });

      console.log("Sample order created");
    } else {
      console.log("An order already exists; no new order created");
    }

    console.log("Seeding completed");
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
