const express = require("express");
const router = express.Router();

const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");

console.log("ORDERS ROUTE FILE LOADED - DELETE FIX");

// CREATE ORDER
router.post("/", async (req, res) => {
    try {
        const {
            userId,
            productId,
            size,
            quantity,
            orderType
        } = req.body;

        if (!userId || !productId || !size) {
            return res.status(400).json({
                error: "User, product, and size are required."
            });
        }

        const orderQuantity = Number(quantity);

        if (!Number.isInteger(orderQuantity) || orderQuantity < 1) {
            return res.status(400).json({
                error: "Quantity must be a positive whole number."
            });
        }

        const user = await User.findById(userId);
        const product = await Product.findById(productId);

        if (!user) {
            return res.status(404).json({
                error: "Customer not found."
            });
        }

        if (!product) {
            return res.status(404).json({
                error: "Product not found."
            });
        }

        const selectedSize = product.sizes.find(
            item => item.name === size
        );

        if (!selectedSize) {
            return res.status(400).json({
                error: "Selected size is not available."
            });
        }

        const unitPrice =
            Number(product.price) +
            Number(selectedSize.priceAdjustment || 0);

        const totalAmount =
            unitPrice * orderQuantity;

        const order = await Order.create({
            user: user._id,

            orderType,
            
            products: [{
                product: product._id,
                size: selectedSize.name,
                fluidOunces: selectedSize.fluidOunces,
                quantity: orderQuantity,
                price: unitPrice
            }],
            totalAmount
        });

        return res.status(201).json({
            message: "Order created successfully.",
            order
        });

    } catch (err) {
        console.error("CREATE ORDER ERROR:", err);

        return res.status(400).json({
            error: err.message
        });
    }
});


// GET ALL ORDERS
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user")
            .populate("products.product")
            .sort({ createdAt: -1 });

        return res.json(orders);

    } catch (err) {
        console.error("GET ORDERS ERROR:", err);

        return res.status(500).json({
            error: err.message
        });
    }
});


// DELETE ORDER
router.delete("/:id", async (req, res) => {

    const orderId = req.params.id;

    console.log("DELETE ORDER ROUTE HIT:", orderId);

    try {

        const order = await Order.findByIdAndDelete(orderId);

        if (!order) {
            console.log("ORDER NOT FOUND:", orderId);

            return res.status(404).json({
                error: "Order not found."
            });
        }

        console.log("ORDER DELETED:", orderId);

        return res.status(200).json({
            message: "Order deleted successfully."
        });

    } catch (err) {

        console.error("DELETE ORDER ERROR:", err);

        return res.status(400).json({
            error: err.message
        });
    }
});


module.exports = router;