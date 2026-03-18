require("dotenv").config();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Room = require("../models/Room");
const { calculatePricing } = require("../services/pricingService");
const connectDB = require("../config/db");
const logger = require("../utils/logger");
const config = require("../config/config");
const { BOOKINGS } = require("./sharedData");


const seedBookings = async () => {
  try {
    await connectDB();
    logger.info("Booking Seeder Starting...");

    if (
      process.env.NODE_ENV === "production" &&
      (await Booking.countDocuments()) > 0
    ) {
      logger.info("Production: Bookings exist, skipping seed");
      process.exit(0);
    }

    // DEV: Always wipe bookings (but check dependencies)
    if (config?.isDev) {
      await Booking.deleteMany({});
      logger.info("🧹 Dev: Cleared existing bookings");
    }

    // DEPENDENCY CHECKS (Enhanced for Prod)
    const users = await User.find({
      email: { $in: BOOKINGS.map((b) => b.email) },
    });
    const rooms = await Room.find();

    if (users.length < BOOKINGS.length) {
      logger.error(
        `❌ Need ${BOOKINGS.length} users! Found ${users.length}.`,
        "Run: npm run seed:users first",
      );
      process.exit(1);
    }

    if (rooms.length === 0) {
      logger.error("❌ No rooms! Run: npm run seed:rooms first");
      process.exit(1);
    }

    logger.info(`Found ${users.length} users, ${rooms.length} rooms`);

    let createdCount = 0;
    for (let i = 0; i < BOOKINGS.length; i++) {
      const bookingData = BOOKINGS[i];
      const user = users.find((u) => u.email === bookingData.email);
      const room = rooms[i % rooms.length];

      if (!user) {
        logger.warn(
          `⚠️  Skipping booking for ${bookingData.email} (user not found)`,
        );
        continue;
      }

      // CALCULATE REAL PRICING
      const pricing = calculatePricing(
        room.price,
        bookingData.checkInDate,
        bookingData.checkOutDate,
        bookingData.adults,
        bookingData.children,
        bookingData.boardType,
      );

      const booking = {
        firstName: bookingData.firstName,
        lastName: bookingData.lastName,
        phone: bookingData.phone,
        email: bookingData.email,
        checkInDate: new Date(bookingData.checkInDate),
        checkOutDate: new Date(bookingData.checkOutDate),
        adults: bookingData.adults,
        children: bookingData.children || 0, 
        boardType: bookingData.boardType,
        note: bookingData.note,
        room: room._id,
        user: user._id,
        nights: pricing.nights,
        roomPrice: room.price,
        totalCost: pricing.totalCost,
        pricingBreakdown: pricing.breakdown,
      };

      await Booking.create(booking);

      logger.info(
        `${bookingData.firstName} ${bookingData.lastName} → ${room.type} (${config?.env})`,
        `from ${bookingData.checkInDate} to ${bookingData.checkOutDate}`,
      );
      logger.info(
        `   ${pricing.nights} nights | ₱${pricing.totalCost.toLocaleString()} TOTAL`,
      );
      createdCount++;
    }

    logger.info(
      `${createdCount} bookings seeded! (${config?.env})`,
    );
    process.exit(0);
  } catch (error) {
    logger.error("❌ Booking seeding failed:", error.message);
    process.exit(1);
  }
};

seedBookings();
