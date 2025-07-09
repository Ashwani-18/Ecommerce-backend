const express = require('express');
const router = express.Router();
const {
  addToCartController,
  getUserCartController,
  removeFromCartController,
  updateCartController,
} = require('../controllers/cartController');

const { auth } = require('../middleware/authMiddleware');

// 🔐 Protect all cart routes using `auth` middleware
router.post('/add', auth, addToCartController);
router.get('/user-cart', auth, getUserCartController);
router.delete('/remove/:productId', auth, removeFromCartController);
router.post('/update', auth, updateCartController);

module.exports = router;
