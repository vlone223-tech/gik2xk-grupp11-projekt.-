const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');

app.use('/products', productRoutes);
app.use('/cart', cartRoutes);

// Test route
app.get('/', (req, res) => {
  res.send("✅ Server is running!");
});

// Start the server
const PORT = process.env.PORT || 3305;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// At the top, require the user routes:
const userRoutes = require('./controllers/userRoutes');

// Then mount the routes:
app.use('/users', userRoutes);
