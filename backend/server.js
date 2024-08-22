const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const logger = require('./config/logger');
const Order = require('./models/Order'); // Adjust the path as necessaryconst User = require('./models/User'); // Import the User modelrequire('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to Database
connectDB();

// Route Middleware
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

// Order Placement Route
app.post('/api/order', async (req, res) => {
  logger.info('Incoming order request:', req.body); // Log the incoming request body

  const { userId, orderDetails } = req.body;

  try {
    // Log the received userId and orderDetails
    logger.info(`Received userId: ${userId}`);
    logger.info(`Received orderDetails: ${JSON.stringify(orderDetails)}`);

    // Validate User ID
    const user = await User.findById(userId);
    if (!user) {
      logger.warn(`User ID ${userId} not found.`);
      throw new Error(`User ID ${userId} not found.`);
    }

    // Log user information
    logger.info(`User found: ${JSON.stringify(user)}`);

    // Create and save the order
    const order = new Order({ userId, orderDetails });
    await order.save();

    // Log the saved order
    logger.info(`Order placed successfully: ${JSON.stringify(order)}`);
    res.status(201).send(order);
  } catch (error) {
    if (error.message.includes('User ID')) {
      logger.warn('Order placement failed: User ID not found', error.message);
    } else if (error.message.includes('Missing required fields')) {
      logger.warn('Order placement failed: Missing required fields', error.message);
    } else {
      logger.error('Error placing order:', error.message);
    }
    res.status(400).send({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));