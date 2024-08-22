const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this secret is the same as used for signing the token
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from headers
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      console.error('Authorization header missing');
      return res.status(401).json({ message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    // Check if token exists
    if (!token) {
      console.error('No token provided');
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded:', decoded); // Log the decoded token for debugging

    // Fetch user from database
    const user = await User.findById(decoded.id);
    if (!user) {
      console.error('User not found');
      return res.status(401).json({ message: 'User not found' });
    }

    // Log user information
    console.log('User found:', user);

    // Attach user to request object
    req.user = user;

    // Proceed to next middleware/route handler
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      console.error('JWT Verification Error: Token expired at', err.expiredAt);
      return res.status(401).json({ message: 'Token expired. Please log in again.' });
    }
    console.error('JWT Verification Error:', err.message);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;