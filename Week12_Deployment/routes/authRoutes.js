const express = require('express');
const router = express.Router();

const {
    register,
    login
} = require('../controllers/authController');

const {
    protect,
    authorize
} = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);

// STEP 11: Protected Admin Route
router.get('/admin', protect, authorize('admin'), (req, res) => {
    res.json({ message: 'Admin access granted' });
});

// LAB CHALLENGE: Protected Profile Route
router.get('/profile', protect, (req, res) => {
    res.json({
        message: 'Profile access granted',
        role: req.user.role
    });
});



module.exports = router;