const Booking = require("../models/Booking");
const User = require("../models/User");

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
    const targetId = req.params.id || req.user._id;
    
    // Self or admin only
    if (req.user._id.toString() !== targetId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Can only delete own account" });
    }

    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Mongoose pre('remove') hook auto-deletes bookings
    await user.deleteOne();
    
    res.json({ message: `User ${user.email} + bookings deleted` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

