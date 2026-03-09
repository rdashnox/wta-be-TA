require("dotenv").config();
const Booking = require("../models/Booking");
const User = require("../models/User");
const Room = require("../models/Room");
const { calculatePricing } = require("../services/pricingService");
const connectDB = require("../config/db");
const logger = require("../utils/logger");

if (process.env.NODE_ENV !== "development") {
  logger.error("Seeder only in development!");
  process.exit(1);
}

const userBookings = [
  {
    email: "user1.wta@maildrop.cc",
    firstName: "John",
    lastName: "Smith",
    phone: "+639171234567",
    checkInDate: "2026-04-15",
    checkOutDate: "2026-04-18",
    adults: 1,
    children: 0,
    boardType: "Breakfast",
    note: "Business conference attendee",
  },
  {
    email: "user2.wta@maildrop.cc",
    firstName: "Anna",
    lastName: "Perez",
    phone: "+639282345678",
    checkInDate: "2026-03-09",
    checkOutDate: "2026-03-16",
    adults: 2,
    children: 4,
    boardType: "Half-board",
    note: "Family vacation with kids",
  },
  {
    email: "user3.wta@maildrop.cc",
    firstName: "Juan",
    lastName: "Dela Cruz",
    phone: "+639393456789",
    checkInDate: "2026-03-22",
    checkOutDate: "2026-03-29",
    adults: 2,
    children: 0,
    boardType: "Half-board",
    note: "Romantic honeymoon getaway",
  },
];

const seedBookings = async () => {
  try {
    await connectDB();

    // DEPENDENCY CHECKS
    const users = await User.find({
      email: { $in: userBookings.map((b) => b.email) },
    });
    const rooms = await Room.find();

    if (users.length !== 3) {
      logger.error(
        `Need 3 users! Found ${users.length}. Run: npm run seed:users`,
      );
      process.exit(1);
    }

    if (rooms.length === 0) {
      logger.error("No rooms! Run: npm run seed:rooms");
      process.exit(1);
    }

    logger.info(`Found ${users.length} users, ${rooms.length} rooms`);

    // CREATE BOOKINGS WITH PRICING SERVICE
    let createdCount = 0;
    for (let i = 0; i < userBookings.length; i++) {
      const bookingData = userBookings[i];
      const user = users.find((u) => u.email === bookingData.email);
      const room = rooms[i % rooms.length];

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
        children: bookingData.children,
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
        `${bookingData.firstName} ${bookingData.lastName} → ${room.type} from ${bookingData.checkInDate} to ${bookingData.checkOutDate}`,
      );
      logger.info(
        `   ${pricing.nights} nights | ₱${pricing.totalCost.toLocaleString()} TOTAL`,
      );
      createdCount++;
    }

    logger.info(`${createdCount} bookings seeded!`);
    process.exit(0);
  } catch (error) {
    logger.error("❌ Booking seeding failed:", error.message);
    process.exit(1);
  }
};

seedBookings();
