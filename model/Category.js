const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      default: "",
    },
    image: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: count of projects in this category
categorySchema.virtual("projectCount", {
  ref: "Project",
  localField: "_id",
  foreignField: "category",
  count: true,
});

// Auto-generate slug from name
categorySchema.pre("validate", function () {
  if (this.name && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
  }
});

module.exports = mongoose.model("Category", categorySchema);
