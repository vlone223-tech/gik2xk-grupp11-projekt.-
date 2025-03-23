const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Product = require('./Product');
const Agent = require('./Agent'); // If you want to track which user gave the rating

const Rating = sequelize.define('Rating', {
  rating: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
});

// Associate ratings with products
Product.hasMany(Rating, { foreignKey: 'productId', as: 'ratings' });
Rating.belongsTo(Product, { foreignKey: 'productId' });

// Optionally, track which user gave the rating:
Agent.hasMany(Rating, { foreignKey: 'userId', as: 'userRatings' });
Rating.belongsTo(Agent, { foreignKey: 'userId' });

module.exports = Rating;
