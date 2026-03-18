const express = require("express");
const passport = require("passport");

const { uploadImage } = require("../controllers/upload.controller");
const upload = require("../middleware/upload");
const { requireRole } = require("../middleware/permissions");

const router = express.Router();

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     summary: Upload image (Admin only)
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Image uploaded
 */

// Protect ALL routes below
router.use(passport.authenticate("jwt", { session: false }));

// Admin-only upload
router.post(
  "/image",
  requireRole(["admin"]),
  upload.single("image"),
  uploadImage,
);

module.exports = router;
