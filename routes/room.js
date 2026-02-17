const express = require("express");
const passport = require("passport");

const {
  getAllRooms,
  getRoomById,
  getRoomPricePreview,
  createRoom,
  updateRoom,
  deleteRoom,
} = require("../controllers/room.controller");

const { requireRole } = require("../middleware/permissions");
const { validateParamId } = require("../middleware/validation");

// New validator imported from your separate file
const { validateRoom } = require("../middleware/validation");

const router = express.Router();

// POST route: Validates admin role, THEN validates room data, THEN creates room
router.post("/", validateRoom, createRoom);

// Public routes
router.get("/", getAllRooms);
router.get("/:id", validateParamId("id"), getRoomById);
router.get("/:id/price", validateParamId("id"), getRoomPricePreview);

// Admin-only routes
router.use(passport.authenticate("jwt", { session: false }));


// PUT route: Validates ID, admin role, room data, THEN updates room
router.put("/:id", validateParamId(), requireRole(["admin"]), validateRoom, updateRoom);

router.delete("/:id", validateParamId(), requireRole(["admin"]), deleteRoom);

module.exports = router;