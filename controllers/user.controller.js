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

    // Check if the user exists first
    const user = await User.findById(targetId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Protection: Prevent an admin from deleting themselves via this route
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot delete your own admin account here." });
    }

    // Use deleteOne() or remove()
    await User.deleteOne({ _id: targetId });

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    console.error("Delete Error:", error); // This helps you see the REAL error in your terminal
    res.status(500).json({ message: "Server error during deletion" });
  }
};

// --- NEW CODE ADDED BELOW ---

exports.getAllUsers = async (req, res) => {
  try {
    // This fetches all accounts from the database
    // .select("-password") ensures we don't send sensitive hashes to the frontend
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};