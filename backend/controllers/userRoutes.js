const express = require('express');
const router = express.Router();
const Agent = require('../models/Agent');
const { Cart } = require('../models/Cart');
const Product = require('../models/Product');

// GET /users - Fetch all users
router.get('/', async (req, res) => {
  try {
    const users = await Agent.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET /users/:id - Fetch a single user by id
router.get('/:id', async (req, res) => {
  try {
    const user = await Agent.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// POST /users - Create a new user
router.post('/', async (req, res) => {
  try {
    const newUser = await Agent.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// PUT /users/:id - Update a user
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Agent.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      res.json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
});

// DELETE /users/:id - Delete a user
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Agent.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// GET /users/:id/getCart - Fetch the current (unpaid) cart for a given user
router.get('/:id/getCart', async (req, res) => {
  const userId = req.params.id;
  try {
    const cart = await Cart.findOne({
      where: { userId, isPaid: false },
      include: [{ model: Product, through: { attributes: ['quantity'] } }]
    });
    if (cart) {
      res.json(cart);
    } else {
      res.status(404).json({ message: "Cart not found for this user" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching user's cart" });
  }
});

// backend/controllers/userRoutes.js
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await Agent.findOne({ where: { email } });
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      // Return basic user info
      return res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Login error' });
    }
  });
  

module.exports = router;
