const bookingService = require("../services/bookingService");
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
    // Ownership already checked by middleware
    await Booking.findByIdAndDelete(req.params.id);
    res.status(204).json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

