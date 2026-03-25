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
 *         description: List of all bookings
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (if not admin)
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
 * /api/booking/my:
 *   get:
 *     summary: Retrieve own bookings (Authenticated user)
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
 *         description: List of bookings for the authenticated user
 *       401:
 *         description: Unauthorized
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
 *   patch:
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [cancelled]
 *                 description: New status for the booking. Only 'cancelled' is allowed for this endpoint.
 *             example:
 *               status: cancelled
 *     responses:
 *       200:
 *         description: Booking cancelled
 *       400:
 *         description: Already cancelled or invalid status
 *       404:
 *         description: Booking not found
 */

/**
 * @swagger
 * /api/booking/{id}:
 *   delete:
 *     summary: Cancel a booking (Soft delete)
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
 *         description: Already cancelled or invalid status
 *       404:
 *         description: Booking not found
 */

// JWT authentication for all booking routes
router.use(passport.authenticate("jwt", { session: false }));

// Admin-only: view all bookings (as per TA CODING SPRINT instructions)
router.get("/", requireRole(["admin"]), bookingController.getAllBookings);

// Users: create + view own bookings
router.post("/", validateBookingCreate, bookingController.createBooking);
router.get("/my", bookingController.getMyBookings); // Dedicated route for authenticated users to get their own bookings

// Owner/Admin: update + cancel booking
router
  .route("/:id")
  .put(
    validateParamId("id"),
    async (req, res, next) => {
      try {
        const Booking = require("../models/Booking");
        const booking = await Booking.findById(req.params.id);
        if (!booking) {
          return res.status(404).json({ message: "Booking not found" });
        }
        req.body._existingCheckInDate = booking.checkInDate;
        next();
      } catch (err) {
        return res.status(500).json({ message: "Server error" });
      }
    },
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
