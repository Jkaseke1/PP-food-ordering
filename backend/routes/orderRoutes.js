const express = require('express');
const { createOrder, getOrders } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to create a new order
router.post('/', authMiddleware, createOrder);

// Route to get all orders
router.get('/', authMiddleware, getOrders);

module.exports = router;