const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        age: {
            type: Number,
            default: null
        },

        flavor: {
            type: String,
            required: true,
            trim: true
        },

        size: {
            type: String,
            required: true,
            trim: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1
        },

        orderType: {
            type: String,
            required: true,
            trim: true
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);