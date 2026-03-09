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

/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: Newsletter subscription routes
 */

/**
 * @swagger
 * /api/subscription:
 *   post:
 *     summary: Subscribe to newsletter
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: subscriber@example.com
 *     responses:
 *       201:
 *         description: Subscribed successfully
 *       400:
 *         description: Validation error or already subscribed
 *
 *   delete:
 *     summary: Unsubscribe from newsletter
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: subscriber@example.com
 *     responses:
 *       200:
 *         description: Unsubscribed successfully
 *       404:
 *         description: Subscription not found
 */

// Public: Subscribe and unsubscribe - Added validateSubscription
router.post("/subscribe", validateSubscription, subscribe);
router.patch("/unsubscribe", unsubscribe);

// Admin only: Protected routes
router.use(passport.authenticate("jwt", { session: false }));
router.get("/", requireRole(["admin"]), getAllSubscriptions);
router.post("/send-newsletter", requireRole(["admin"]), sendNewsletter);

module.exports = router;
