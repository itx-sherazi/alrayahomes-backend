const Lead = require("../model/Lead");

// @desc    Submit inquiry (public)
// @route   POST /api/leads
// @access  Public
const createLead = async (req, res) => {
  try {
    const { name, phone, email, message, project, type, source } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: "Name and phone are required" });
    }

    const lead = await Lead.create({ name, phone, email, message, project, type, source });

    res.status(201).json({ success: true, message: "Inquiry submitted successfully", lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all leads (admin)
// @route   GET /api/leads
// @access  Admin
const getLeads = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20, search, startDate, endDate } = req.query;

    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Lead.countDocuments(query);

    const leads = await Lead.find(query)
      .populate("project", "title slug")
      .populate("assignedTo", "name email")
      .sort("-createdAt")
      .skip(skip)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / Number(limit)), leads });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Admin
const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id)
      .populate("project", "title slug location")
      .populate("assignedTo", "name email");

    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update lead status / assign / notes
// @route   PUT /api/leads/:id
// @access  Admin
const updateLead = async (req, res) => {
  try {
    const { status, assignedTo, notes, followUpDate } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { status, assignedTo, notes, followUpDate },
      { new: true, runValidators: true }
    )
      .populate("project", "title slug")
      .populate("assignedTo", "name email");

    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });

    res.json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Admin
const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ success: false, message: "Lead not found" });
    res.json({ success: true, message: "Lead deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get lead stats (admin dashboard)
// @route   GET /api/leads/stats
// @access  Admin
const getLeadStats = async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: "new" });
    const contacted = await Lead.countDocuments({ status: "contacted" });
    const converted = await Lead.countDocuments({ status: "converted" });

    // Leads by type
    const byType = await Lead.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    // Last 7 days leads
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentLeads = await Lead.countDocuments({ createdAt: { $gte: sevenDaysAgo } });

    res.json({ success: true, stats: { total, newLeads, contacted, converted, byType, recentLeads } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createLead, getLeads, getLead, updateLead, deleteLead, getLeadStats };
