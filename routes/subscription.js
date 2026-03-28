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
 * /api/subscription/subscribe:
 *   post:
 *     summary: Subscribe to newsletter
 *     description: |
 *       Subscribes a user after verifying email.
 *       
 *       📧 Side Effects:
 *       - Sends confirmation email
 *       - Sends "welcome back" email if resubscribed
 *       
 *       ⚠️ Email must be valid (verified externally)
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *                 example: subscriber@example.com
 *     responses:
 *       201:
 *         description: Subscribed successfully
 *       400:
 *         description: Already subscribed or invalid email
 */

/**
 * @swagger
 * /api/subscription/unsubscribe:
 *   patch:
 *     summary: Unsubscribe from newsletter
 *     description: |
 *       Unsubscribes a user after verifying email.
 *       
 *       📧 Side Effects:
 *       - Sends unsubscribe confirmation email
 *     tags: [Subscription]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
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

/**
 * @swagger
 * /api/subscription:
 *   get:
 *     summary: Get all subscriptions (Admin only)
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of subscriptions
 */

/**
 * @swagger
 * /api/subscription/send-newsletter:
 *   post:
 *     summary: Simulate sending newsletter (Admin only)
 *     description: Returns count of active subscribers
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Newsletter simulation successful
 */

// Public: Subscribe and unsubscribe - Added validateSubscription
router.post("/subscribe", validateSubscription, subscribe);
router.patch("/unsubscribe", unsubscribe);

// Admin only: Protected routes
router.use(passport.authenticate("jwt", { session: false }));
router.get("/", requireRole(["admin"]), getAllSubscriptions);
router.post("/send-newsletter", requireRole(["admin"]), sendNewsletter);

module.exports = router;
