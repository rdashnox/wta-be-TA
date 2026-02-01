require("dotenv").config();
const User = require("../models/User");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Subscription = require("../models/Subscription");
const connectDB = require("../config/db");

if (process.env.NODE_ENV !== "development") {
  console.error("Seeder can only run in development!");
  process.exit(1);
}

const deleteAllResources = async () => {
  try {
    await connectDB();
    console.log("🧹 Cleaning ALL resources (admin preserved)...");

    // Delete regular users + their bookings
    const regularUsers = await User.find({ role: "user" });
    console.log(`Found ${regularUsers.length} regular users`);

    for (const user of regularUsers) {
      const bookingCount = await Booking.deleteMany({ user: user._id });
      console.log(
        `🗑️ ${user.email}: ${bookingCount.deletedCount} bookings deleted`,
      );
    }

    // Delete ALL resources
    const deletedCounts = {
      users: await User.deleteMany({ role: "user" }),
      bookings: await Booking.deleteMany({}),
      rooms: await Room.deleteMany({}),
      subscriptions: await Subscription.deleteMany({}),
    };

    // 3. Verify admin remains
    const admin = await User.findOne({ email: "admin.wta@maildrop.cc" });
    if (!admin) {
      console.error("❌ Admin user missing! Run seed:users first.");
      process.exit(1);
    }

    console.log("\n✅ CLEAN SETUP COMPLETE:");
    console.log(`🗑️ Deleted: ${JSON.stringify(deletedCounts, null, 2)}`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Delete failed:", error.message);
    process.exit(1);
  }
};

deleteAllResources();
