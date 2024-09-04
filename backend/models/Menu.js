const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  caterer: { type: String, required: true },
  items: [{ name: String, description: String, price: Number }]
});

module.exports = mongoose.model('Menu', menuSchema);