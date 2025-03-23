// backend/models/Agent.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Agent = sequelize.define('Agent', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' }, // "admin" or "user"
});

module.exports = Agent;
