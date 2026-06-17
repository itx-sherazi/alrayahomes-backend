const User = require("../model/User");
const Lead = require("../model/Lead");

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Admin
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role } = req.query;

    const query = {};
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Admin
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("savedProjects", "title slug images location");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const inquiries = await Lead.find({ email: user.email })
      .populate("project", "title slug")
      .sort("-createdAt")
      .limit(10);

    res.json({ success: true, user, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role / status (admin)
// @route   PUT /api/users/:id
// @access  Admin
const updateUser = async (req, res) => {
  try {
    const { role, isActive } = req.body;

    // Prevent admin from demoting themselves
    if (req.params.id === req.user._id.toString() && role === "user") {
      return res.status(400).json({ success: false, message: "Cannot change your own role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, isActive },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Admin
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "Cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/users/stats/dashboard
// @access  Admin
const getDashboardStats = async (req, res) => {
  try {
    const Project = require("../model/Project");
    const Category = require("../model/Category");

    const [totalProjects, totalUsers, totalLeads, totalCategories, newLeads, featuredProjects] = await Promise.all([
      Project.countDocuments({ status: "active" }),
      User.countDocuments({ role: "user" }),
      Lead.countDocuments(),
      Category.countDocuments({ isActive: true }),
      Lead.countDocuments({ status: "new" }),
      Project.countDocuments({ featured: true, status: "active" }),
    ]);

    // Recent leads (last 5)
    const recentLeads = await Lead.find()
      .populate("project", "title")
      .sort("-createdAt")
      .limit(5);

    // Monthly leads for chart (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyLeads = await Lead.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({
      success: true,
      stats: {
        totalProjects,
        totalUsers,
        totalLeads,
        totalCategories,
        newLeads,
        featuredProjects,
        recentLeads,
        monthlyLeads,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, getUser, updateUser, deleteUser, getDashboardStats };
