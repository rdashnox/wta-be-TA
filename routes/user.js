const express = require("express");
const passport = require("passport");
const { getProfile, deleteAccount } = require("../controllers/user.controller");
const router = express.Router();

router.get(
  "/profile",
  passport.authenticate("jwt", { session: false }),
  getProfile,
);

router.delete("/:id?", deleteAccount);

module.exports = router;
