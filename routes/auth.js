const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const { register, login } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

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
