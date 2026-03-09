const mongoose = require("mongoose");
const config = require("./config");
const logger = require("../utils/logger");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  try {
    let mongoUri = config.mongoUri;

    if (config.isTest) {
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      logger.ifo("Using in-memory MongoDB for testing 🧪");
    } else if (config.env === "development") {
      logger.info(`Connecting to MongoDB on DEV mode 🌱`);
    } else {
      logger.info("MongoDB connected 🚀");
    }

    await mongoose.connect(mongoUri);
  } catch (error) {
    logger.error("MongoDB connection failed. Retrying in 5 seconds...");

    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;

