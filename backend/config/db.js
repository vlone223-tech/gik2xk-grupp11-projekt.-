const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: 3306, // adjust if needed
    logging: false,
    dialectOptions: {
      connectTimeout: 10000,
    },
  }
);

sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((err) => console.error("❌ Database connection failed:", err));

module.exports = sequelize;
