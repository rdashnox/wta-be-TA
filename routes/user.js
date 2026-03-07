const express = require("express");
const passport = require("passport");
// 1. Added getAllUsers to the list of imports
const { getProfile, deleteAccount, getAllUsers } = require("../controllers/user.controller");
const { validateParamId } = require("../middleware/validation");

const router = express.Router();

// 2. Added the GET / route to fetch all users
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  getAllUsers
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
  deleteAccount                                    
);

module.exports = router;