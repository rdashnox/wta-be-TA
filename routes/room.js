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

const router = express.Router();

// Public routes
router.get("/", getAllRooms);
router.get("/:id", validateParamId("id"), getRoomById);
router.get("/:id/price", validateParamId("id"), getRoomPricePreview);

// Admin-only routes
router.use(passport.authenticate("jwt", { session: false }));
router.post("/", requireRole(["admin"]), createRoom);
router.put("/:id", validateParamId(), requireRole(["admin"]), updateRoom);
router.delete("/:id", validateParamId(), requireRole(["admin"]), deleteRoom);

module.exports = router;
