const mongoose = require('mongoose');

const CatererSchema = new mongoose.Schema({
  name: { type: String, required: true },
  menu: [
    {
      meal: { type: String, required: true },
      price: { type: Number, required: true }
    }
  ]
});

module.exports = mongoose.model('Caterer', CatererSchema);