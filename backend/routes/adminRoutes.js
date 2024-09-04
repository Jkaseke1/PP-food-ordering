const express = require('express');
const adminMiddleware = require('../middleware/adminMiddleware');
const router = express.Router();

// Example admin route
router.get('/manage-users', adminMiddleware, async (req, res) => {
  // Logic to manage users
  res.send('Admin access granted to manage users');
});

module.exports = router;