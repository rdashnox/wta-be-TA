const express = require("express");
const passport = require("passport");

const {
  subscribe,
  unsubscribe,
  getAllSubscriptions,
  sendNewsletter,
} = require("../controllers/subscription.controller");

const { requireRole } = require("../middleware/permissions");

// Import subscription validator
const { validateSubscription } = require("../middleware/validation");

const router = express.Router();

// Public: Subscribe and unsubscribe - Added validateSubscription 
router.post("/subscribe", validateSubscription, subscribe);
router.patch("/unsubscribe", unsubscribe);

// Admin only: Protected routes
router.use(passport.authenticate("jwt", { session: false }));
router.get("/", requireRole(["admin"]), getAllSubscriptions);
router.post("/send-newsletter", requireRole(["admin"]), sendNewsletter);

module.exports = router;
