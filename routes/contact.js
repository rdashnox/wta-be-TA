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

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact message routes
 */

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit a new contact message
 *     description: |
 *       Sends a contact message after verifying the email.
 *
 *       📧 Side Effects:
 *       - Sends notification email to admin
 *       - Sends confirmation email to user
 *
 *       ⚠️ Note:
 *       - Email must be valid (verified via external API)
 *       - Disposable emails are allowed for testing
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, message]
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               subject:
 *                 type: string
 *                 example: Inquiry
 *               message:
 *                 type: string
 *                 example: Hello, I have a question.
 *     responses:
 *       201:
 *         description: Message submitted successfully
 *       400:
 *         description: Validation error or invalid email
 */

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Get all contact messages (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of contact messages
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/contact/{id}/read:
 *   put:
 *     summary: Mark a contact message as read (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message marked as read
 *       404:
 *         description: Message not found
 */

// Public: Create contact message - added validateContact and contactLimiter
router.post("/", contactLimiter, validateContact, createContactMessage); // Apply rate limiter to contact form submissions

// Admin only: Protected routes
router.use(passport.authenticate("jwt", { session: false }));
router.get("/", requireRole(["admin"]), getAllContactMessages);
router.put("/:id/read", requireRole(["admin"]), markMessageAsRead);

module.exports = router;
