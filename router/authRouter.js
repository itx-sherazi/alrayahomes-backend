const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const {
  register,
  login,
  getMe,
} = require("../controller/authController");

// Register is admin-only only existing admins can create new admin accounts
router.post("/register", protect, admin, register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;
