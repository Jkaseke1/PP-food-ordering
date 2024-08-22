const Order = require('../models/Order');
const logger = require('../config/logger');

exports.createOrder = async (req, res) => {
  const { caterer, date, meal, quantity, selectedItems } = req.body;

  if (!caterer || !date || !meal || quantity == null) {
    logger.warn('Order creation failed: Missing required fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    console.log('Authenticated user ID:', req.user._id); // Log the authenticated user ID for debugging

    const newOrder = new Order({
      userId: req.user._id, // Use req.user._id for the authenticated user's ID
      caterer,
      date,
      meal,
      quantity,
      selectedItems
    });

    const savedOrder = await newOrder.save();
    logger.info('Order created successfully', { orderId: savedOrder._id });
    res.status(201).json({ message: 'Order created successfully!', order: savedOrder });
  } catch (err) {
    logger.error('Error creating order:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};