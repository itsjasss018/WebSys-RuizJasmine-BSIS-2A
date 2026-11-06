const dns = require("node:dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");

const app = express();
console.log("MATCHAHOLIC SERVER FILE LOADED");
mongoose.set("strictQuery", true);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", (req, res, next) => {
    console.log("USERS API HIT:", req.method, req.originalUrl);
    next();
}, usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", (req, res, next) => {
  console.log("ORDERS API HIT:", req.method, req.originalUrl);
  next();
}, ordersRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON payload" });
  }

  console.error("Unhandled server error:", err);
  return res.status(500).json({ error: "Internal server error" });
});

async function start() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
  }

  try {
   await mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000
});

console.log("MongoDB connected");

const PORT = process.env.PORT || 3000;


    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("MongoDB connection failed:");
    console.error(err.message);
    process.exit(1);
  }
}

start();