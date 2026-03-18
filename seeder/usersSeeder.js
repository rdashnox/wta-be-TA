require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const connectDB = require("../config/db");
const { USERS } = require("./sharedData");
const logger = require("../utils/logger");
const config = require("../config/config");

const seedUsers = async () => {
  try {
    await connectDB();

    // PROD SAFETY: Skip if ANY users exist
    if (
      process.env.NODE_ENV === "production" &&
      (await User.countDocuments()) > 0
    ) {
      console.log("Production: Users exist, skipping seed");
      process.exit(0);
    }

    // DEV: Always wipe + reseed
    if (config?.isDev) {
      await User.deleteMany();
      logger.info("🧹 Dev: Cleared users");
    }

    const hashPassword = async (password) => await bcrypt.hash(password, 10);

    const usersWithHash = await Promise.all(
      USERS.map(async (user) => ({
        ...user,
        password: await hashPassword(user.password),
      })),
    );

    await User.insertMany(usersWithHash);
    logger.info(
      `${usersWithHash.length} users seeded (${config?.env})`,
    );
    process.exit(0);
  } catch (err) {
    logger.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seedUsers();
