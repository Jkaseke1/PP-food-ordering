const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  caterer: { type: String, required: true },
  date: { type: Date, required: true },
  meal: { type: String, required: true },
  quantity: { type: Number, required: true },
  selectedItems: [
    {
      name: { type: String, required: true },
      category: { type: String, required: true }
    }
  ]
});

// Check if the model already exists before defining it
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

module.exports = Order;