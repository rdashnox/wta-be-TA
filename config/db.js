const mongoose = require("mongoose");
const config = require("./config");
const logger = require("../utils/logger");

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri = config.mongoUri;

    if (config.isTest) {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
      }
      mongoUri = mongoServer.getUri();
      logger.info("Using in-memory MongoDB for testing 🧪");
    } else if (config.env === "development") {
      logger.info(`Connecting to MongoDB on DEV mode 🌱`);
    } else {
      logger.info("MongoDB connected 🚀");
    }

    await mongoose.connect(mongoUri);
  } catch (error) {
    logger.error("MongoDB connection failed:", error);

    // ❗ Do not retry in test mode (causes open handles in Jest)
    if (!config.isTest && config.isDev) {
      setTimeout(connectDB, 5000);
    }
  }
};

module.exports = connectDB;
