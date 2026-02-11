/**
 * Booking routes
 *
 * Uses:
 *   - Passport JWT authentication
 *   - Role & ownership middleware
 *   - Joi validation middleware (generic)
 *   - Domain-specific booking schemas
 *
 * Endpoints:
 *   GET /all        -> Admin only: view all bookings
 *   POST /          -> User: create booking
 *   GET /           -> User: view own bookings
 *   PUT /:id        -> Owner/Admin: update booking
 *   DELETE /:id     -> Owner/Admin: cancel booking
 */

const express = require("express");
const passport = require("passport");
const bookingController = require("../controllers/booking.controller");

const { requireOwnership, requireRole } = require("../middleware/permissions");

const {
  validateBookingUpdate,
  validateBookingCreate,
  validateParamId,
} = require("../middleware/validation");

const router = express.Router();

// JWT authentication for all booking routes
router.use(passport.authenticate("jwt", { session: false }));

// Admin-only: view all bookings
router.get("/all", requireRole(["admin"]), bookingController.getAllBookings);

// Users: create + view own bookings
router.post("/", validateBookingCreate, bookingController.createBooking);
router.get("/", bookingController.getMyBookings);

// Owner/Admin: update + cancel booking
router
  .route("/:id")
  .put(
    async (req, res, next) => {
      const Booking = require("../models/Booking");
      try {
        const booking = await Booking.findById(req.params.id);
        if (!booking)
          return res.status(404).json({ message: "Booking not found" });

        // Attach existing checkInDate for Joi validation
        req.body._existingCheckInDate = booking.checkInDate;
        next();
      } catch (err) {
        next(err);
      }
    },
    validateParamId("id"),
    validateBookingUpdate,
    requireOwnership("Booking"),
    bookingController.updateBooking,
  )
  .delete(
    validateParamId("id"),
    requireOwnership("Booking"),
    bookingController.cancelBooking,
  );

module.exports = router;
