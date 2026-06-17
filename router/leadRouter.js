const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const { createLead, getLeads, getLead, updateLead, deleteLead, getLeadStats } = require("../controller/leadController");

// Public
router.post("/", createLead);

// Admin
router.get("/stats", protect, admin, getLeadStats);
router.get("/", protect, admin, getLeads);
router.get("/:id", protect, admin, getLead);
router.put("/:id", protect, admin, updateLead);
router.delete("/:id", protect, admin, deleteLead);

module.exports = router;
