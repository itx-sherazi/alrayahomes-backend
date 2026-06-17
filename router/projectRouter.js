const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const { uploadProjectImages } = require("../utils/cloudinary");
const {
  getProjects,
  getProject,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProjectImage,
  deleteProject,
} = require("../controller/projectController");

// Public routes
router.get("/", getProjects);

// Admin routes (must be before /:slug to avoid param conflict)
router.get("/admin/all", protect, admin, getAdminProjects);
router.get("/:slug", getProject);
router.post("/", protect, admin, uploadProjectImages, createProject);
router.put("/:id", protect, admin, uploadProjectImages, updateProject);
router.delete("/:id/images/:public_id", protect, admin, deleteProjectImage);
router.delete("/:id", protect, admin, deleteProject);

module.exports = router;
