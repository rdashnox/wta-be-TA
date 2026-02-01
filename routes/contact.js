const express = require("express");
const passport = require("passport");

const {
  createContactMessage,
  getAllContactMessages,
  markMessageAsRead,
} = require("../controllers/contact.controller");

const { requireRole } = require("../middleware/permissions");

const router = express.Router();

// Public: Create contact message
router.post("/", createContactMessage);

// Admin only: Protected routes
router.use(passport.authenticate("jwt", { session: false }));
router.get("/", requireRole(["admin"]), getAllContactMessages);
router.put("/:id/read", requireRole(["admin"]), markMessageAsRead);

module.exports = router;
