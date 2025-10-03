const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  items: [
    {
      productId: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'menus',
          required: true
      },
      quantity: {
         type: Number,
         required: true,
         min: 1
      }
    }
  ],
  status: {
  type: String,
  enum: ['pending', 'successful', 'failed'],
  default: 'pending'
},
  totalAmount: {
     type: Number,
     required: true,
     min: 0
  },
  userId: {
     type: mongoose.Schema.Types.ObjectId,
     ref: 'Users',
     required: true
  }
});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;