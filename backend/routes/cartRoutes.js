const express = require('express');
const router = express.Router();
const { Cart, CartItem } = require('../models/Cart');
const Product = require('../models/Product');

// POST /cart/addProduct - add a product to a cart
router.post('/addProduct', async (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    // Find or create an active cart for the user
    let [cart] = await Cart.findOrCreate({ where: { userId, isPaid: false } });
    // Check if product already exists in the cart
    let cartItem = await CartItem.findOne({ where: { cartId: cart.id, productId } });
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({ cartId: cart.id, productId, quantity });
    }
    res.json({ message: "Product added to cart", cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding product to cart" });
  }
});

// GET /cart/:userId - fetch the current cart for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({
      where: { userId, isPaid: false },
      include: [{ model: Product, through: { attributes: ['quantity'] } }]
    });
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart" });
  }
});

module.exports = router;
