require("dotenv").config();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const connectDB = require("../config/db");

// Only run in dev
if (process.env.NODE_ENV !== "development") {
  console.error("Seeder can only run in development!");
  process.exit(1);
}

const seedUsers = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    console.log("Existing users deleted");

    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    };

    const users = [
      {
        email: "user1.wta@maildrop.cc",
        password: await hashPassword("123456"),
        role: "user",
      },
      {
        email: "user2.wta@maildrop.cc",
        password: await hashPassword("123456"),
        role: "user",
      },
      {
        email: "user3.wta@maildrop.cc",
        password: await hashPassword("123456"),
        role: "user",
      },
      {
        email: "admin.wta@maildrop.cc",
        password: await hashPassword("admin123"),
        role: "admin",
      },
    ];

    await User.insertMany(users);
    console.log("Users seeded successfully");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

seedUsers();
