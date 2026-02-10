const mongoose = require("mongoose");
const config = require("./config");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  try {
    let mongoUri = config.mongoUri;

    if (config.isTest) {
      const mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log("Using in-memory MongoDB for testing 🧪");
    } else if (config.env === "development") {
      console.log(`Connecting to MongoDB on DEV mode 🌱`);
    } else {
      console.log("MongoDB connected 🚀");
    }

    await mongoose.connect(mongoUri);
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
