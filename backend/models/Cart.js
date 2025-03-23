const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');

// Cart model: represents a user's cart
const Cart = sequelize.define('Cart', {
  userId: { type: DataTypes.INTEGER, allowNull: false },
  isPaid: { type: DataTypes.BOOLEAN, defaultValue: false }
});

// Association table for Cart and Product
const CartItem = sequelize.define('CartItem', {
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 }
});

Cart.belongsToMany(Product, { through: CartItem, foreignKey: 'cartId' });
Product.belongsToMany(Cart, { through: CartItem, foreignKey: 'productId' });

module.exports = { Cart, CartItem };
