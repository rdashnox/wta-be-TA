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
