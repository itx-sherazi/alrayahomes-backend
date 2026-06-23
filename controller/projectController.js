const Project = require("../model/Project");
const { deleteFromCloudinary } = require("../utils/cloudinary");

// @desc    Get all projects (public - with filter/search/pagination)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { category, type, city, minPrice, maxPrice, featured, search, status, page = 1, limit = 12, sort = "-createdAt" } = req.query;

    const query = { status: "active" };

    if (category) {
      // Support filtering by category slug or ObjectId
      const mongoose = require("mongoose");
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.category = category;
      } else {
        const Category = require("../model/Category");
        const cat = await Category.findOne({ slug: category });
        if (cat) query.category = cat._id;
        else query.category = null; // no match
      }
    }
    if (type) query.type = type;
    if (city) query["location.city"] = { $regex: city, $options: "i" };
    if (featured === "true") query.featured = true;
    if (minPrice || maxPrice) {
      query["price.min"] = {};
      if (minPrice) query["price.min"].$gte = Number(minPrice);
      if (maxPrice) query["price.min"].$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
        { "location.area": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Project.countDocuments(query);

    const projects = await Project.find(query)
      .populate("category", "name slug icon")
      .select("-floorPlans")
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      count: projects.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project by slug
// @route   GET /api/projects/:slug
// @access  Public
const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug })
      .populate("category", "name slug icon")
      .populate("createdBy", "name");

    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    // Increment views
    project.views += 1;
    await project.save();

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all projects for admin (all statuses)
// @route   GET /api/projects/admin/all
// @access  Admin
const getAdminProjects = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status, type } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "location.city": { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .populate("category", "name slug")
      .select("title slug status type location price featured views createdAt images")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Admin
const createProject = async (req, res) => {
  try {
    const body = { ...req.body, createdBy: req.user._id };

    // Parse JSON strings from form data
    if (typeof body.amenities === "string") body.amenities = JSON.parse(body.amenities);
    if (typeof body.features === "string") body.features = JSON.parse(body.features);
    if (typeof body.paymentPlans === "string") body.paymentPlans = JSON.parse(body.paymentPlans);
    if (typeof body.location === "string") body.location = JSON.parse(body.location);
    if (typeof body.price === "string") body.price = JSON.parse(body.price);
    if (typeof body.size === "string") body.size = JSON.parse(body.size);

    // Attach uploaded images
    if (req.files && req.files.length > 0) {
      body.images = req.files.map((file, index) => ({
        url: file.path,
        public_id: file.filename,
        isMain: index === 0,
      }));
    }

    const project = await Project.create(body);
    await project.populate("category", "name slug");

    res.status(201).json({ success: true, project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Admin
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    const body = { ...req.body };
    if (typeof body.amenities === "string") body.amenities = JSON.parse(body.amenities);
    if (typeof body.features === "string") body.features = JSON.parse(body.features);
    if (typeof body.paymentPlans === "string") body.paymentPlans = JSON.parse(body.paymentPlans);
    if (typeof body.location === "string") body.location = JSON.parse(body.location);
    if (typeof body.price === "string") body.price = JSON.parse(body.price);
    if (typeof body.size === "string") body.size = JSON.parse(body.size);

    // Append new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => ({
        url: file.path,
        public_id: file.filename,
        isMain: false,
      }));
      body.images = [...(project.images || []), ...newImages];
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, body, {
      new: true,
      runValidators: true,
    }).populate("category", "name slug");

    res.json({ success: true, project: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project image
// @route   DELETE /api/projects/:id/images/:public_id
// @access  Admin
const deleteProjectImage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    const publicId = decodeURIComponent(req.params.public_id);
    await deleteFromCloudinary(publicId);
    project.images = project.images.filter((img) => img.public_id !== publicId);
    await project.save();

    res.json({ success: true, message: "Image deleted", project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: "Project not found" });

    // Delete all images from Cloudinary
    for (const img of project.images) {
      if (img.public_id) await deleteFromCloudinary(img.public_id);
    }
    for (const fp of project.floorPlans) {
      if (fp.image?.public_id) await deleteFromCloudinary(fp.image.public_id);
    }

    await project.deleteOne();
    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProjects, getProject, getAdminProjects, createProject, updateProject, deleteProjectImage, deleteProject };
