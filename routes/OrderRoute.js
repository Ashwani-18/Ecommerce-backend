const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');
const { auth } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/authMiddleware');

router.get('/my-orders', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('products.product')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
});

// Cancel an order
router.patch('/cancel/:orderId', auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOneAndUpdate(
      { _id: orderId, user: req.user.id },
      { status: 'cancelled' },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or not authorized' });
    }
    res.status(200).json({ success: true, order, message: 'Order cancelled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to cancel order' });
  }
});

// Admin: Get all orders
router.get('/all', auth, isAdmin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'email')
      .populate('products.product')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch all orders' });
  }
});

// Admin: Update order status
router.patch('/status/:orderId', auth, isAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    if (!['pending', 'shipped', 'delivered', 'cancelled'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).populate('user', 'email').populate('products.product');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, order, message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update order status' });
  }
});

module.exports = router;
