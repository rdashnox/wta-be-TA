const express = require("express");
const passport = require("passport");
const apicache = require("apicache");

const {
  getAllRooms,
  getRoomById,
  getRoomPricePreview,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/room.controller");

const { requireRole } = require("../middleware/permissions");
const { validateParamId, validateRoom } = require("../middleware/validation");

const router = express.Router();

const cache = apicache.middleware;

// Middleware for client caching
const clientCache = (req, res, next) => {
  res.set("Cache-Control", "public, max-age=300"); // 5 minutes
  next();
};

/**
 * @swagger
 * tags:
 *   name: Rooms
 *   description: Room management and retrieval
 */

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: List of rooms
 *
 *   post:
 *     summary: Create a new room (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       201:
 *         description: Room created
 */

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room details
 *       404:
 *         description: Room not found
 *
 *   put:
 *     summary: Update a room (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Room'
 *     responses:
 *       200:
 *         description: Room updated
 *       404:
 *         description: Room not found
 *
 *   delete:
 *     summary: Delete a room (Admin only)
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Room deleted
 *       404:
 *         description: Room not found
 */

// Public routes with caching
router.get("/", clientCache, cache("5 minutes"), getAllRooms);

router.get(
  "/:id",
  validateParamId("id"),
  clientCache,
  cache("5 minutes"),
  getRoomById,
);

router.get(
  "/:id/price",
  validateParamId("id"),
  clientCache,
  cache("5 minutes"),
  getRoomPricePreview,
);

// Protected routes — Admin only
router.use(passport.authenticate("jwt", { session: false }));

router.post("/", requireRole(["admin"]), validateRoom, createRoom);
router.put(
  "/:id",
  validateParamId("id"),
  requireRole(["admin"]),
  validateRoom,
  updateRoom,
);
router.delete(
  "/:id",
  validateParamId("id"),
  requireRole(["admin"]),
  deleteRoom,
);

module.exports = router;
