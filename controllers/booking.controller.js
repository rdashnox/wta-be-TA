const bookingService = require("../services/bookingService");
const Room = require("../models/Room");
const Booking = require("../models/Booking");

/**
 * Create new booking (User authenticated via JWT)
 * Expects: firstName, lastName, phone, email, dates, adults, room, boardType
 */
exports.createBooking = async (req, res) => {
  try {
    const booking = await bookingService.createBooking(req.body, req.user._id);
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Get current user's bookings (User authenticated)
 */
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getUserBookings(req.user._id);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all bookings (Admin only)
 */
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate(["room", "user"]);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update own booking (User) or any booking (Admin)
 */
exports.updateBooking = async (req, res) => {
  try {
    const updates = req.body;
    const booking = await bookingService.updateBooking(
      req.params.id,
      updates,
      req.user._id,
    );
    res.json({ message: "Booking updated", booking });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Delete own booking (User) or any booking (Admin)
 */
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Ownership already checked by middleware, but verify status
    if (booking.status === "cancelled") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    await Booking.findByIdAndUpdate(req.params.id, {
      status: "cancelled",
    });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get available rooms for a specific type and dates
exports.getAvailableRooms = async (req, res) => {
  try {
    const { type, checkInDate, checkOutDate } = req.query;

    // Parse dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Find rooms of the specified type
    const rooms = await Room.find({ type });

    // Get active bookings that overlap with the requested dates
    const bookings = await Booking.find({
      room: { $in: rooms.map((room) => room._id) },
      status: "active", // Only consider active bookings
      $or: [
        { checkInDate: { $lte: checkOut }, checkOutDate: { $gte: checkIn } },
        { checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } },
      ],
    });

    // For each room, calculate how many are available based on overlapping active bookings
    const availableRooms = rooms.filter((room) => {
      const bookedCount = bookings.filter(
        (booking) => booking.room.toString() === room._id.toString(),
      ).length;

      return room.capacity > bookedCount; // Room is available if capacity is greater than bookedCount
    });

    if (availableRooms.length === 0) {
      return res
        .status(404)
        .json({ message: "No rooms available for the selected dates." });
    }

    res.json(availableRooms);
  } catch (error) {
    console.error("Error getting available rooms:", error);
    res.status(500).json({ message: "Error calculating room availability." });
  }
};
