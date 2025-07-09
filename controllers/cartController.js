const CartModel = require('../models/CartModel');



exports.addToCartController = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      cart = new CartModel({
        user: userId,
        items: [{ product: productId, quantity: quantity || 1 }]
      });
    } else {
      const index = cart.items.findIndex(item => item.product.toString() === productId);
      if (index > -1) {
        cart.items[index].quantity += quantity || 1;
      } else {
        cart.items.push({ product: productId, quantity: quantity || 1 });
      }
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("Add to cart error:", err, "User:", req.user, "Body:", req.body);
    res.status(500).json({ success: false, message: "Add to cart failed", error: err.message });
  }
};

exports.getUserCartController = async (req, res) => {
  try {
    const cart = await CartModel.findOne({ user: req.user.id }).populate("items.product");
    if (!cart) return res.status(200).json({ success: true, cart: [] });

    res.json({ success: true, cart: cart.items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Fetch cart failed" });
  }
};

exports.removeFromCartController = async (req, res) => {
  try {
    const productId = req.params.productId;
    const cart = await CartModel.findOne({ user: req.user.id });

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();

    res.json({ success: true, message: "Item removed", cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Remove failed" });
  }
};

exports.updateCartController = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    const cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not found in cart" });
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update cart failed", error: err.message });
  }
};
