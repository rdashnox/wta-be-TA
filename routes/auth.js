const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { loginLimiter } = require("../middleware/rateLimiter");
const config = require("../config/config");

const { register, login } = require("../controllers/auth.controller");

const { validateRegister, validateLogin } = require("../middleware/validation");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication routes
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 example: user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation or user already exists error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: JWT token returned
 *       401:
 *         description: Invalid credentials
 */

// Add validation before the controllers and apply rate limiter to both register and login routes
router.post("/register", loginLimiter, validateRegister, register);
router.post("/login", loginLimiter, validateLogin, login);

router.get("/google", (req, res, next) => {
  const frontend = req.query.origin; // need to pass this from frontend
  const state = Buffer.from(JSON.stringify({ frontend })).toString("base64");

  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state,
  })(req, res, next);
});

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

    // Decode state
    let frontendUrl = config.frontendUrls[0]; // fallback
    if (req.query.state) {
      try {
        const parsed = JSON.parse(
          Buffer.from(req.query.state, "base64").toString(),
        );

        if (config.frontendUrls.includes(parsed.frontend)) {
          frontendUrl = parsed.frontend;
        }
      } catch (e) {}
    }

    res.redirect(`${frontendUrl}/oauth-success?token=${access}`);
  },
);

module.exports = router;
