const Booking = require("../models/Booking");
const User = require("../models/User");
const logger = require("../utils/logger");

exports.getProfile = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const bookingCount = await Booking.countDocuments({ user: req.user._id });
  res.json({
    id: req.user._id,
    email: req.user.email,
    role: req.user.role,
    bookingCount,
  });
};

exports.deleteAccount = async (req, res) => {
  try {
    const targetId = req.params.id;

    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Protection: Prevent an admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own admin account here." });
    }

    await User.deleteOne({ _id: targetId });

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    logger.error("Delete Error:", error); // This helps you see the REAL error in your terminal
    res.status(500).json({ message: "Server error during deletion" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const { page, limit } = req.query;

    // Old behavior (no pagination)
    if (!page && !limit) {
      const users = await User.find({}).select("-password");
      return res.json(users);
    }

    // Pagination mode
    const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const [users, total] = await Promise.all([
      User.find({})
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize),

      User.countDocuments(),
    ]);

    res.json({
      page: pageNumber,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize),
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
