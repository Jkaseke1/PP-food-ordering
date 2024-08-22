const Order = require('../models/Order');
const User = require('../models/User');
const Menu = require('../models/Menu'); // Import the Menu model
const { sendEmail } = require('../utils/emailService');

// Get orders by caterer and day
exports.getOrdersByCatererAndDay = async (req, res) => {
  const { caterer, day } = req.params;

  try {
    const orders = await Order.find({ caterer, date: day });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get financial statements
exports.getFinancialStatements = async (req, res) => {
  const { userId, period } = req.body;

  try {
    const orders = await Order.find({ userId });
    
    // Calculate financial statements based on orders and period
    const statements = calculateFinancialStatements(orders, period);
    res.json(statements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Helper function to calculate financial statements
const calculateFinancialStatements = (orders, period) => {
  const statements = {}; // Initialize your statements object

  // Calculate totals based on the specified period
  orders.forEach(order => {
    const date = new Date(order.date);
    const key = period === 'weekly' ? 
      `${date.getFullYear()}-W${getWeekNumber(date)}` : 
      `${date.getFullYear()}-${date.getMonth() + 1}`;

    if (!statements[key]) {
      statements[key] = { total: 0, count: 0 };
    }
    statements[key].total += order.total; // Assuming order has a 'total' field
    statements[key].count += 1;
  });

  return statements;
};

// Function to get week number
const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - startDate) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + startDate.getDay() + 1) / 7);
};

// Send orders to email
exports.sendOrdersToEmail = async (req, res) => {
  const { email, orders } = req.body;

  try {
    const emailContent = `Orders: \n${JSON.stringify(orders, null, 2)}`;
    await sendEmail(email, 'Orders List', emailContent);
    res.json({ message: 'Orders sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update the menu
exports.updateMenu = async (req, res) => {
  const { menu } = req.body;

  try {
    const updatedMenu = await Menu.findOneAndUpdate(
      { caterer: menu.caterer },
      { $set: { items: menu.items } },
      { new: true, upsert: true } // Create if it doesn't exist
    );

    res.json({ message: 'Menu updated successfully', menu: updatedMenu });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lock or unlock ordering
exports.lockOrdering = async (req, res) => {
  const { isOrderingLocked } = req.body;

  try {
    await Menu.updateMany({}, { $set: { isLocked: isOrderingLocked } }); // Lock/unlock for all menus
    res.json({ message: `Ordering has been ${isOrderingLocked ? 'locked' : 'unlocked'}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get the menu
exports.getMenu = async (req, res) => {
  try {
    const menu = await Menu.find(); // Fetch the menu from the database
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Prevent order placement if ordering is locked
exports.createOrder = async (req, res) => {
  const { caterer, date, meal, quantity, selectedItems } = req.body;

  try {
    // Check if ordering is locked
    const menu = await Menu.findOne({ caterer });
    if (menu && menu.isLocked) {
      return res.status(403).json({ message: 'Ordering is currently locked.' });
    }

    const newOrder = new Order({
      userId: req.user._id,
      caterer,
      date,
      meal,
      quantity,
      selectedItems
    });

    const savedOrder = await newOrder.save();
    res.status(201).json({ message: 'Order placed successfully!', order: savedOrder });
  } catch (err) {
    res.status(500).json({ message: 'Internal server error' });
  }
};