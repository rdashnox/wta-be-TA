const app = require("../app");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");
const Room = require("../models/Room");

module.exports = {
  app,

  async connectTestDB() {
    await connectDB();
  },

  async clearDB() {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  },

  async disconnectDB() {
    // FIXED: Check if connected before operations
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    }
  },

  async createTestUser(overrides = {}) {
    return User.create({
      email: `test${Date.now()}@mail.com`,
      password: "password123",
      role: "user",
      ...overrides
    });
  },

  async createTestRoom(overrides = {}) {
    return Room.create({
      type: "Standard Room",
      price: 2500,
      maxGuests: 2,
      images: [],
      ...overrides
    });
  },

  async createAdminUser() {
    return User.create({
      email: `admin${Date.now()}@mail.com`,
      password: "admin123",
      role: "admin"
    });
  }
};
