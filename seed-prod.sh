#!/bin/bash
set -e  # Exit on any error

echo "NODE_ENV: $NODE_ENV"

# Skip if users exist (prod-safe)
if [ "$NODE_ENV" = "production" ]; then
  node -e "
    const mongoose = require('mongoose');
    require('dotenv').config();
    mongoose.connect(process.env.MONGO_URI).then(async () => {
      const User = require('./models/User');
      const count = await User.countDocuments();
      process.exit(count > 0 ? 0 : 1);
    });
  " && echo "Production data exists. Skipping seed." && exit 0;
fi

echo "🌱 Initial seeding with sharedData (users → rooms → bookings)..."

# Sequential seeding
npm run seed:users
echo "Users seeded"

npm run seed:rooms  
echo "Rooms seeded"

npm run seed:bookings
echo "Bookings seeded"

echo "👤 Admin: admin.wta@maildrop.cc / admin123"
echo "📚 Swagger docs: http://localhost:${PORT}/api/docs"
