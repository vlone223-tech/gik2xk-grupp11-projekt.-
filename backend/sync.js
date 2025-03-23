// sync.js
const sequelize = require('./config/db');
const Product = require('./models/Product');
const Agent = require('./models/Agent');
const { Cart, CartItem } = require('./models/Cart');
const Rating = require('./models/Rating');

sequelize
  .sync({ alter: true })
  .then(async () => {
    console.log("✅ All models synchronized successfully.");

    // Now we seed the admin accounts INSIDE this block:
    await Agent.findOrCreate({
      where: { email: 'AdminUbah@wb.se' },
      defaults: { name: 'Ubah', password: 'admin123', role: 'admin' }
    });
    await Agent.findOrCreate({
      where: { email: 'adminIlhan@wb.se' },
      defaults: { name: 'Ilhan', password: 'admin123', role: 'admin' }
    });
    await Agent.findOrCreate({
      where: { email: 'adminAbdi@wb.se' },
      defaults: { name: 'Abdiaziz', password: 'admin123', role: 'admin' }
    });

    console.log("✅ Seeding complete. Exiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error synchronizing models:", error);
    process.exit(1);
  });
