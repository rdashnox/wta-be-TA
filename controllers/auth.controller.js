const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

exports.register = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || password.length < 6) {
      return res
        .status(400)
        .json({ message: "Email and password (6+ chars) required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingUser) {
      return res.status(400).json({ message: "User exists" });
    }

    // Validate role
    const allowedRoles = ["user", "admin"];
    let assignedRole = "user";
    if (role && allowedRoles.includes(role)) {
      assignedRole = role;
    }

    // Create new user
    const newUser = await User.create({
      email: email.toLowerCase().trim(),
      password,
      role: assignedRole,
    });

    // Create JWT
    const access = jwt.sign(
      {
        id: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
      },
      config.jwtSecret,
      { expiresIn: "1h" },
    );

    res.status(201).json({
      access,
      user: {
        id: newUser._id.toString(),
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Prevent Local Login for Google Users
    if (user.provider === "google") {
      return res.status(400).json({
        message: "Please login with Google",
      });
    }

    const access = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      config.jwtSecret,
      { expiresIn: "1h" },
    );

    res.json({
      access,
      user: { id: user._id.toString(), email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(400).json({ message: "Server error" });
  }
};
