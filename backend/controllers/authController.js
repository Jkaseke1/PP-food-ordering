const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
exports.register = async (req, res) => {
  const { username, lastname, email, password } = req.body;

  // Email validation
  const validEmailDomains = ['@tpg.co.zw', '@pulse-pharmaceuticals.co.zw'];
  const isValidEmail = validEmailDomains.some(domain => email.endsWith(domain));

  if (!isValidEmail) {
    return res.status(400).json({ message: 'Invalid email domain' });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  // Determine if the user should be an admin
  const isAdmin = email === 'jkaseke@tpg.co.zw';

  // Create a new user
  const user = new User({ username, lastname, email, password: hashedPassword, isAdmin });
  await user.save();

  res.status(201).json({ message: 'User registered successfully', isAdmin });
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token, user });
};