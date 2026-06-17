const Category = require("../model/Category");
const { deleteFromCloudinary } = require("../utils/cloudinary");

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ order: 1, createdAt: 1 })
      .populate("projectCount");
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all categories (admin - includes inactive)
// @route   GET /api/categories/all
// @access  Admin
const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ order: 1 }).populate("projectCount");
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).populate("projectCount");
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Admin
const createCategory = async (req, res) => {
  try {
    const { name, description, icon, order } = req.body;

    const imageData = req.file
      ? { url: req.file.path, public_id: req.file.filename }
      : { url: "", public_id: "" };

    const category = await Category.create({
      name,
      description,
      icon,
      order,
      image: imageData,
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Admin
const updateCategory = async (req, res) => {
  try {
    const { name, description, icon, order, isActive } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (req.file) {
      if (category.image?.public_id) {
        await deleteFromCloudinary(category.image.public_id);
      }
      category.image = { url: req.file.path, public_id: req.file.filename };
    }

    category.name = name || category.name;
    category.description = description ?? category.description;
    category.icon = icon ?? category.icon;
    category.order = order ?? category.order;
    category.isActive = isActive ?? category.isActive;

    await category.save();
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Admin
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    if (category.image?.public_id) {
      await deleteFromCloudinary(category.image.public_id);
    }

    await category.deleteOne();
    res.json({ success: true, message: "Category deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories, getAllCategories, getCategory, createCategory, updateCategory, deleteCategory };
