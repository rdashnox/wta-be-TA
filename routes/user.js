const express = require("express");
const passport = require("passport");
const { getProfile, deleteAccount } = require("../controllers/user.controller");
const { validateParamId } = require("../middleware/validation");
const { requireOwnership } = require("../middleware/permissions");

const router = express.Router();

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getProfile,
);

router.delete(
  "/:id",
  validateParamId("id"),
  requireOwnership("User", "_id", ["admin"]),
  deleteAccount,
);

module.exports = router;
