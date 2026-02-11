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
    const targetId = req.params.id;

    const user = await User.findById(targetId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Mongoose pre('remove') hook auto-deletes bookings
    await user.deleteOne();

    res.status(200).json({ message: "User deleted!" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
