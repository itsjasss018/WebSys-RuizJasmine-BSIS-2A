const mongoose = require("mongoose");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env")
});
const Product = require("../models/Product");

const sizes = [
  { name: "Demi", fluidOunces: 3, priceAdjustment: -40 },
  { name: "Short", fluidOunces: 8, priceAdjustment: -20 },
  { name: "Tall", fluidOunces: 12, priceAdjustment: 0 },
  { name: "Grande", fluidOunces: 16, priceAdjustment: 20 },
  { name: "Venti", fluidOunces: 20, priceAdjustment: 40 },
  { name: "Trenta", fluidOunces: 30, priceAdjustment: 70 }
];

const products = [
  {
    name: "Classic Matcha",
    price: 249,
    description: "Our signature creamy and refreshing matcha."
  },
  {
    name: "Strawberry Matcha",
    price: 269,
    description: "Refreshing matcha with sweet strawberry flavor."
  },
  {
    name: "Biscoff Matcha",
    price: 279,
    description: "Creamy matcha with a delightful Biscoff flavor."
  },
  {
    name: "Coconut Matcha",
    price: 269,
    description: "Smooth matcha with a refreshing coconut twist."
  },
  {
    name: "Blueberry Ube Matcha",
    price: 279,
    description: "A unique blend of matcha, blueberry, and ube."
  },
  {
    name: "Pistachio Matcha",
    price: 289,
    description: "Rich and creamy matcha with pistachio flavor."
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    for (const product of products) {
      await Product.updateOne(
        { name: product.name },
        {
          $set: {
            ...product,
            sizes
          }
        },
        { upsert: true, runValidators: true }
      );
    }

    console.log("Matchaholic products added successfully!");
    console.log(`Products processed: ${products.length}`);
  } catch (error) {
    console.error("Error adding products:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();