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

const router = express.Router();

// Public routes
router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.get("/:id/price", getRoomPricePreview);

// Admin-only routes
router.use(passport.authenticate("jwt", { session: false }));
router.post("/", requireRole(["admin"]), createRoom);
router.put("/:id", requireRole(["admin"]), updateRoom);
router.delete("/:id", requireRole(["admin"]), deleteRoom);

module.exports = router;
