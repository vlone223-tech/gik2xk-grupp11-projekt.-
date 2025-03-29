const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Rating = require('../models/Rating'); // Make sure this path is correct

// GET /products - fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ association: 'ratings' }] // Include ratings if needed
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
});

// GET /products/:id - fetch single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ association: 'ratings' }]
    });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
});

// POST /products - create a new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: "Error creating product" });
  }
});

// PUT /products/:id - update product
router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Product.update(req.body, { where: { id: req.params.id } });
    if (updated) {
      res.json({ message: "Product updated successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating product" });
  }
});

// DELETE /products/:id - delete product
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: "Product deleted successfully" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
});

// POST /products/:id/addRating - add a rating
router.post('/:id/addRating', async (req, res) => {
  try {
    // Ensure the product exists before adding a rating
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Get the rating data from the request body
    const { rating, comment } = req.body;
    // Create a new rating associated with the product
    const newRating = await Rating.create({
      rating,
      comment,
      productId: req.params.id
    });
    res.status(201).json(newRating);
  } catch (error) {
    res.status(500).json({ message: "Error adding rating", error: error.message });
  }
});

module.exports = router;
