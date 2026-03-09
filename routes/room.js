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

// --- Middleware for client caching ---
const clientCache = (req, res, next) => {
  res.set("Cache-Control", "public, max-age=300"); // 5 minutes
  next();
};

// --- Public routes with caching ---
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
