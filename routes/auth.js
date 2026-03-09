const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { loginLimiter } = require("../middleware/rateLimiter");
const config = require("../config/config");

const { register, login } = require("../controllers/auth.controller");

// Import auth validator
const { validateRegister, validateLogin } = require("../middleware/validation");

const router = express.Router();

// Add validation before the controllers and apply rate limiter to both register and login routes
router.post("/register", loginLimiter, validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const user = req.user;

    const access = jwt.sign(
      {
        id: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: "1h" },
    );

    // Redirect to frontend with token
    res.redirect(`${config.frontendUrl}/oauth-success?token=${access}`);
  },
);

module.exports = router;
