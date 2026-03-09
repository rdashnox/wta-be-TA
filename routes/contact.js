const express = require("express");
const passport = require("passport");
const { contactLimiter } = require("../middleware/rateLimiter");

const {
  createContactMessage,
  getAllContactMessages,
  markMessageAsRead,
} = require("../controllers/contact.controller");

const { requireRole } = require("../middleware/permissions");

// Import contact validator
const { validateContact } = require("../middleware/validation");

const router = express.Router();

// Public: Create contact message - added validateContact and contactLimiter
router.post("/", contactLimiter, validateContact, createContactMessage); // Apply rate limiter to contact form submissions

// Admin only: Protected routes
router.use(passport.authenticate("jwt", { session: false }));
router.get("/", requireRole(["admin"]), getAllContactMessages);
router.put("/:id/read", requireRole(["admin"]), markMessageAsRead);

module.exports = router;
