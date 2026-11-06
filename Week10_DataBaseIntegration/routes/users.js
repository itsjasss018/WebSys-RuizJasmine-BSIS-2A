const express = require("express");
const router = express.Router();
const User = require("../models/User");
console.log("UPDATED USERS ROUTE LOADED");
// CREATE USER
router.post("/", async (req, res) => {
    try {
        console.log("REQUEST BODY:", req.body);

        const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            age: req.body.age,
            flavor: req.body.flavor,
            size: req.body.size,
            quantity: req.body.quantity,
            orderType: req.body.orderType,
            unitPrice: Number(req.body.unitPrice),
            totalPrice: Number(req.body.totalPrice)
        });

        console.log("SAVED USER:", user.toObject());

        return res.status(201).json(user);
    } catch (err) {
        console.error("CREATE USER ERROR:", err);

        return res.status(400).json({
            error: err.message
        });
    }
});

// READ USERS (FILTER BY EMAIL WHEN PROVIDED)
router.get("/", async (req, res) => {
    try {
        console.log("USER GET QUERY:", req.query);

        const { email } = req.query;

        const filter = email
            ? { email: new RegExp(`^${email}$`, "i") }
            : {};

        console.log("USER FILTER:", filter);

        const users = await User.find(filter)
            .sort({ createdAt: -1 });

        console.log("USERS FOUND:", users.length);

        return res.json(users);
    } catch (err) {
        console.error("READ USERS ERROR:", err);

        return res.status(500).json({
            error: err.message
        });
    }
});

// DELETE USER
router.delete("/:id", async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);

        if (!deletedUser) {
            return res.status(404).json({
                error: "User not found."
            });
        }

        return res.json({
            message: "User deleted successfully."
        });
    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
});

module.exports = router;
