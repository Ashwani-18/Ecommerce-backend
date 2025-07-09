const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },

  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
      quantity: { type: Number, required: true, min: 1 },
    }
  ],

  payment: {
    razorpay_order_id: { type: String, required: true },
    razorpay_payment_id: { type: String, required: true },
    razorpay_signature: { type: String, required: true },
    amount: { type: Number, required: true, min: 1 },
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zip: { type: String },
    country: { type: String }
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  }

}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
