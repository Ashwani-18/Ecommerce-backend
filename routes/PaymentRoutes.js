const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { auth } = require('../middleware/authMiddleware');
const OrderModel = require('../models/OrderModel');
const CartModel = require('../models/CartModel');
const mongoose = require('mongoose');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
router.post('/create-order', auth, async (req, res) => {
  try {
    console.log("🟢 Creating order for amount:", req.body.amount);
    const options = {
      amount: req.body.amount * 100, // in paise
      currency: 'INR',
      receipt: `order_rcptid_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("❌ Error creating Razorpay order:", error);
    res.status(500).json({ success: false, message: 'Order creation failed', error: error.message });
  }
});

// Verify payment & store order
// Verify payment & store order
router.post('/verify', auth, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, address } = req.body;

  console.log("🔁 Verifying Payment with:", req.body);

  try {
    // 1. Verify Razorpay signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = hmac.digest('hex');

    console.log("✅ Calculated digest:", digest);
    console.log("📦 Razorpay Signature:", razorpay_signature);

    if (digest !== razorpay_signature) {
      console.error("❌ Signature mismatch!");
      return res.status(400).json({
        success: false,
        message: 'Signature mismatch',
        expected: digest,
        received: razorpay_signature
      });
    }

    console.log("Step 1: Signature verified");
    const userCart = await CartModel.findOne({ user: req.user.id }).populate('items.product');
    console.log("Step 2: userCart:", userCart);
    if (!userCart || !Array.isArray(userCart.items) || userCart.items.length === 0) {
      console.log("Step 2.1: Cart is empty or invalid");
      return res.status(400).json({ success: false, message: 'Cart is empty or invalid' });
    }
    const order = new OrderModel({
      user: req.user.id,
      products: userCart.items.map(item => ({
        product: item.product._id ? item.product._id : item.product,
        quantity: item.quantity
      })),
      payment: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        amount: amount || 0
      },
      address: address || {},
    });
    try {
      await order.save();
      console.log("Step 3: Order saved");
    } catch (err) {
      console.error("❌ Error saving order:", err);
      return res.status(500).json({ success: false, message: 'Order save failed', error: err.message });
    }
    await CartModel.findOneAndDelete({ user: new mongoose.Types.ObjectId(req.user.id) });
    console.log("Step 4: Cart cleared");
    res.status(200).json({ success: true, message: '✅ Payment verified and order saved' });
  } catch (error) {
    console.error('❌ Server error during payment verification:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during payment verification',
      error: error.message
    });
  }
});


module.exports = router;
