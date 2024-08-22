const express = require('express');
const { placeOrder } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to place an order
router.post('/order', authMiddleware, placeOrder);

module.exports = router;