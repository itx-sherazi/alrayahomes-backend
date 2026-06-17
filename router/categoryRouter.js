const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/auth");
const { uploadCategoryImage } = require("../utils/cloudinary");
const {
  getCategories,
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/categoryController");

router.get("/", getCategories);
router.get("/all", protect, admin, getAllCategories);
router.get("/:slug", getCategory);
router.post("/", protect, admin, uploadCategoryImage, createCategory);
router.put("/:id", protect, admin, uploadCategoryImage, updateCategory);
router.delete("/:id", protect, admin, deleteCategory);

module.exports = router;
