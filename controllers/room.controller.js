const Room = require("../models/Room");
const { calculatePricing } = require("../services/pricingService");
const apicache = require("apicache");
const cache = apicache.middleware;

// Duration for cache
const CACHE_DURATION = "5 minutes";

// Get all rooms (Public)
exports.getAllRooms = [
  cache(CACHE_DURATION), // Cache this response
  async (req, res) => {
    try {
      const rooms = await Room.find();
      res.json(rooms);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

// Get single room by ID (Public)
exports.getRoomById = [
  cache(CACHE_DURATION),
  async (req, res) => {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) return res.status(404).json({ message: "Room not found" });
      res.json(room);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
];

// PRICE PREVIEW (Public - Frontend cart)
exports.getRoomPricePreview = [
  cache(CACHE_DURATION),
  async (req, res) => {
    try {
      const { id } = req.params;
      const {
        checkInDate,
        checkOutDate,
        adults,
        children = 0,
        boardType,
      } = req.query;

      if (!checkInDate || !checkOutDate || !adults || !boardType) {
        return res
          .status(400)
          .json({ message: "Missing required pricing parameters" });
      }

      const room = await Room.findById(id);
      if (!room) return res.status(404).json({ message: "Room not found" });

      const pricing = calculatePricing(
        room.price,
        checkInDate,
        checkOutDate,
        parseInt(adults),
        parseInt(children),
        boardType,
      );

      res.json({
        room,
        pricing,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
];

/**
 * --- ADMIN CRUD ROUTES WITH CACHE INVALIDATION ---
 */

exports.createRoom = async (req, res) => {
  try {
    const { type, price, maxGuests, images } = req.body;

    const room = await Room.create({ type, price, maxGuests, images });

    // Clear cached room GET endpoints
    apicache.clear("/api/rooms*");

    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Clear cached room GET endpoints
    apicache.clear("/api/rooms*");

    res.json(room);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    // Clear cached room GET endpoints
    apicache.clear("/api/rooms*");

    res.json({ message: "Room deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
