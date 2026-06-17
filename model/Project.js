const mongoose = require("mongoose");

const floorPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  area: { type: String },
});

const paymentPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  downPayment: { type: String },
  installment: { type: String },
  duration: { type: String },
  note: { type: String },
});

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Project description is required"],
    },
    shortDescription: {
      type: String,
      maxlength: 300,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    type: {
      type: String,
      enum: ["residential", "commercial", "villa", "apartment", "townhouse", "investment"],
      required: [true, "Project type is required"],
    },
    location: {
      city: { type: String, required: true },
      area: { type: String },
      address: { type: String },
      mapUrl: { type: String },
    },
    price: {
      min: { type: Number },
      max: { type: Number },
      label: { type: String },
    },
    size: {
      min: { type: String },
      max: { type: String },
      unit: { type: String, default: "Marla" },
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
        caption: { type: String },
        isMain: { type: Boolean, default: false },
      },
    ],
    floorPlans: [floorPlanSchema],
    amenities: [{ type: String }],
    paymentPlans: [paymentPlanSchema],
    features: [{ type: String }],
    status: {
      type: String,
      enum: ["active", "inactive", "sold-out", "upcoming"],
      default: "active",
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
    developerName: {
      type: String,
      default: "Al Raya Homes",
    },
    completionDate: {
      type: String,
    },
    totalUnits: {
      type: Number,
    },
    availableUnits: {
      type: Number,
    },
    brochureUrl: {
      type: String,
    },
    videoUrl: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: lead count for this project
projectSchema.virtual("leadCount", {
  ref: "Lead",
  localField: "_id",
  foreignField: "project",
  count: true,
});

// Auto-generate slug from title
projectSchema.pre("validate", function () {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
      + "-" + Date.now();
  }
});

// Increment views
projectSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

module.exports = mongoose.model("Project", projectSchema);
