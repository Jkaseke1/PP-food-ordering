const express = require('express');
const {
  getOrdersByCatererAndDay,
  getFinancialStatements,
  sendOrdersToEmail,
  getAllOrders,
  updateMenu,
  lockOrdering,
  getMenu // Ensure this function is included
} = require('../controllers/adminController');

const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Log imported functions to check if they are defined
console.log(getOrdersByCatererAndDay, getFinancialStatements, sendOrdersToEmail, getAllOrders, updateMenu, lockOrdering, getMenu);

// Route to get orders by caterer and day
router.get('/orders/:caterer/:day', authMiddleware, adminMiddleware, getOrdersByCatererAndDay);

// Route to get financial statements
router.post('/financial-statements', authMiddleware, adminMiddleware, getFinancialStatements);

// Route to send orders to email
router.post('/send-orders', authMiddleware, adminMiddleware, sendOrdersToEmail);

// Route to get all orders
router.get('/orders', authMiddleware, adminMiddleware, getAllOrders);

// Route to get the menu
router.get('/menu', authMiddleware, adminMiddleware, getMenu); // Ensure this is correct

// Route to update the menu
router.post('/menu', authMiddleware, adminMiddleware, updateMenu);

// Route to lock/unlock ordering
router.post('/toggle-order-verification', authMiddleware, adminMiddleware, lockOrdering);

module.exports = router;