require("dotenv").config();

const config = {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wtadb",
  jwtSecret: process.env.JWT_SECRET,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  isTest: process.env.NODE_ENV === "test",
};

if (!config.mongoUri || !config.jwtSecret) {
  console.error("ERROR: Essential environment variables missing in .env!");
  process.exit(1);
}

console.log(`Environment variables loaded (${config.env})`);
module.exports = config;
