const Order = require('../models/Order');

// Create Order
exports.createOrder = async (req, res) => {
  const { user, caterer, date, selectedItems } = req.body;

  // Ensure user ID is provided
  if (!user) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Create a new order
  const order = new Order({
    user, // This should be the user ID from the request
    caterer,
    date,
    selectedItems,
  });

  try {
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Failed to create order', error });
  }
};

// Get Orders
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error });
  }
};