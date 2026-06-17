const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const { getUsers, getUser, updateUser, deleteUser, getDashboardStats } = require("../controller/userController");

router.get("/stats/dashboard", protect, admin, getDashboardStats);
router.get("/", protect, admin, getUsers);
router.get("/:id", protect, admin, getUser);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
