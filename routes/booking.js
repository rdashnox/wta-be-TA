const express = require("express");
const passport = require("passport");
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  cancelBooking,
  getAvailableRooms, 
} = require("../controllers/booking.controller");
const { validateBookingCreate, validateBookingUpdate } = require('../middleware/validation');

const { requireOwnership, requireRole } = require("../middleware/permissions");

const router = express.Router();

// JWT REQUIRED FOR ALL ROUTES
router.use(passport.authenticate("jwt", { session: false }));

// ADMIN ONLY: View ALL bookings
router.get("/all", requireRole(["admin"]), getAllBookings);

// USER: Create + View own bookings
router.post("/", validateBookingCreate, createBooking);
router.get("/", getMyBookings);

// OWNER/ADMIN: Update + Delete booking by ID
router
  .route("/:id")
  .put(validateBookingUpdate, requireOwnership("Booking"), updateBooking)
  .delete(requireOwnership("Booking"), cancelBooking);

// Route to check available rooms
router.get("/available", getAvailableRooms);

module.exports = router;
