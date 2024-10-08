const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

// Route to register a new user
router.post('/register', register);

// Route to login a user
router.post('/login', login);

module.exports = router;