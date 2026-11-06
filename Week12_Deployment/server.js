const dns = require('node:dns');
dns.setServers(['8.8.8.8']);

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();


// ================================
// ROUTES
// ================================

const usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const authRoutes = require('./routes/authRoutes');


// ================================
// APP
// ================================

const app = express();


// ================================
// MIDDLEWARE
// ================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ================================
// STATIC FILES
// ================================

app.use(express.static(path.join(__dirname, 'public')));


// ================================
// EXISTING WEEK 10 ROUTES
// ================================

app.use('/api/users', usersRouter);
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);


// ================================
// WEEK 11 AUTH ROUTES
// ================================

app.use('/api/auth', authRoutes);

console.log('AUTH ROUTES MOUNTED AT /api/auth');


// ================================
// HEALTH CHECK
// ================================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok'
    });
});


// ================================
// HOME
// ================================

app.get('/', (req, res) => {
    res.sendFile(
        path.join(__dirname, 'public', 'index.html')
    );
});


// ================================
// 404 HANDLER
// ================================

// DO NOT use app.get('*', ...)
// because your Express version causes
// "Missing parameter name at index 1"

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        method: req.method,
        path: req.originalUrl
    });
});


// ================================
// ERROR HANDLER
// ================================

app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);

    res.status(500).json({
        error: err.message
    });
});


// ================================
// DATABASE + SERVER
// ================================

const PORT = process.env.PORT || 3000;

async function start() {

    const uri = process.env.MONGO_URI;

    if (!uri) {
        console.error('Missing MONGO_URI in .env');
        process.exit(1);
    }

    try {

        await mongoose.connect(uri);

        console.log('MongoDB connected');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error('MongoDB connection error:', error);

        process.exit(1);
    }
}








start();