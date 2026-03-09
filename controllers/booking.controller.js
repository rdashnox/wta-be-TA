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
    const { page, limit } = req.query;

    // Old behavior (no pagination)
    if (!page && !limit) {
      const bookings = await bookingService.getUserBookings(req.user._id);
      return res.json(bookings);
    }

    // Pagination enabled
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const [bookings, total] = await Promise.all([
      Booking.find({ user: req.user._id })
        .populate("room")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),

      Booking.countDocuments({ user: req.user._id }),
    ]);

    res.json({
      page: pageNumber,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize),
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all bookings (Admin only)
 */
exports.getAllBookings = async (req, res) => {
  try {
    const filter = {};
    const { page, limit, status } = req.query;

    if (status) {
      filter.status = status;
    }

    // Old behavior (no pagination)
    if (!page && !limit) {
      const bookings = await Booking.find(filter)
        .populate(["room", "user"])
        .sort({ createdAt: -1 });

      return res.json(bookings);
    }

    // Pagination
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const [bookings, total] = await Promise.all([
      Booking.find(filter)
        .populate(["room", "user"])
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),

      Booking.countDocuments(filter),
    ]);

    res.json({
      page: pageNumber,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize),
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * Update own booking (User) or any booking (Admin)
 */
exports.updateBooking = async (req, res) => {
  try {
    const booking = await bookingService.updateBooking(req.params.id, req.body);
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
