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

/**
 * @swagger
 * tags:
 *   name: Bookings
 *   description: Booking management routes
 */

/**
 * @swagger
 * /api/booking:
 *   get:
 *     summary: Get all bookings (Admin only)
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, cancelled, completed]
 *         description: Optional status filter
 *     responses:
 *       200:
 *         description: List of bookings
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Create a new booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       201:
 *         description: Booking created
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/booking/{id}:
 *   put:
 *     summary: Update a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Booking'
 *     responses:
 *       200:
 *         description: Booking updated
 *       400:
 *         description: Validation error
 *
 *   delete:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Booking ID
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       400:
 *         description: Already cancelled
 *       404:
 *         description: Booking not found
 */

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
