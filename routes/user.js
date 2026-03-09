const express = require("express");
const passport = require("passport");

const {
  getProfile,
  deleteAccount,
  getAllUsers,
} = require("../controllers/user.controller");
const { validateParamId } = require("../middleware/validation");
const { requireRole } = require("../middleware/permissions");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management routes
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users (password hidden)
 *       401:
 *         description: Unauthorized
 *
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Admin cannot delete themselves
 */

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  requireRole(["admin"]),
  getAllUsers,
);
router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getProfile,
);

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  validateParamId("id"),
  deleteAccount,
);

module.exports = router;
