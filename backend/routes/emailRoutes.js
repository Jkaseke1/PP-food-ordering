const express = require('express');
const { sendOrderConfirmation } = require('../controllers/emailController');

const router = express.Router();

// Route to send order confirmation email
router.post('/send-order-confirmation', sendOrderConfirmation);

module.exports = router;