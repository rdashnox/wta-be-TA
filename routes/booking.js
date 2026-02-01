const express = require("express");
const passport = require("passport");
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBooking,
  cancelBooking,
} = require("../controllers/booking.controller");

const { requireOwnership, requireRole } = require("../middleware/permissions");

const router = express.Router();

// JWT REQUIRED FOR ALL ROUTES
router.use(passport.authenticate("jwt", { session: false }));

// USER: Create + View own bookings
router.post("/", createBooking);
router.get("/", getMyBookings);

// OWNER/ADMIN: Update + Delete own/specific booking
router
  .route("/:id")
  .put(requireOwnership("Booking"), updateBooking)
  .delete(requireOwnership("Booking"), cancelBooking);

// ADMIN ONLY: View ALL bookings
router.get("/all", requireRole(["admin"]), getAllBookings);

module.exports = router;
