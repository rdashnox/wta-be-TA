require("dotenv").config();
const Room = require("../models/Room");
const connectDB = require("../config/db");
const { ROOMS } = require("./sharedData");
const config = require("../config/config");
const logger = require("../utils/logger");

const seedRooms = async () => {
  try {
    await connectDB();

    // PROD: Skip if rooms exist
    if (
      process.env.NODE_ENV === "production" &&
      (await Room.countDocuments()) > 0
    ) {
      console.log("Production: Rooms exist, skipping");
      process.exit(0);
    }

    // DEV: Always wipe
    if (config?.isDev) {
      await Room.deleteMany({});
      logger.info("🧹 Dev: Cleared rooms");
    }

    await Room.insertMany(ROOMS);
    logger.info(`${ROOMS.length} rooms seeded (${process.env.NODE_ENV})`);
    process.exit(0);
  } catch (error) {
    logger.error("❌ Room seeding failed:", error.message);
    process.exit(1);
  }
};

seedRooms();
