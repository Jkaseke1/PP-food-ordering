// models/Menu.js
const mongoose = require('mongoose');

const MenuSchema = new mongoose.Schema({
  caterer: { type: String, required: true },
  items: [{
    name: { type: String, required: true },
    category: { type: String, required: true }
  }],
  isLocked: { type: Boolean, default: false } // Add a field to lock/unlock ordering
});

// Check if the model already exists before defining it
const Menu = mongoose.models.Menu || mongoose.model('Menu', MenuSchema);

module.exports = Menu;