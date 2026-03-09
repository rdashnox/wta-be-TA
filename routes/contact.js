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
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               message:
 *                 type: string
 *                 example: Hello, I have a question about your services.
 *     responses:
 *       201:
 *         description: Message submitted successfully
 *       400:
 *         description: Validation error
 *
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
 * /api/contact/{id}:
 *   put:
 *     summary: Mark a contact message as read (Admin only)
 *     tags: [Contact]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Contact message ID
 *     responses:
 *       200:
 *         description: Message marked as read
 *       404:
 *         description: Message not found
 *       401:
 *         description: Unauthorized
 */

// Public: Create contact message - added validateContact and contactLimiter
router.post("/", contactLimiter, validateContact, createContactMessage); // Apply rate limiter to contact form submissions

// Admin only: Protected routes
router.use(passport.authenticate("jwt", { session: false }));
router.get("/", requireRole(["admin"]), getAllContactMessages);
router.put("/:id/read", requireRole(["admin"]), markMessageAsRead);

module.exports = router;
