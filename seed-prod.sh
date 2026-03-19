#!/bin/bash
set -e 

echo "NODE_ENV: $NODE_ENV"

# Skip if users exist OR if not production
if [ "$NODE_ENV" = "production" ]; then
  node -e "
    require('dotenv').config();
    const mongoose = require('mongoose');
    mongoose.connect(process.env.MONGO_URI).then(async () => {
      const User = require('./models/User');
      const count = await User.countDocuments();
      process.exit(count > 0 ? 0 : 1);  // 0=skip, 1=seed
    });
  " && echo "Production data exists. Skipping seed." && exit 0;
fi

echo "🌱 Seeding production data..."
npm run deploy:seed
echo "✅ Production seed complete!"
echo "👤 Admin: admin.wta@maildrop.cc / admin123"
