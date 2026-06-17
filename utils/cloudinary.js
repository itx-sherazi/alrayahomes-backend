const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for project images
const projectImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "alrayahomes/projects",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 1200, height: 800, crop: "limit", quality: "auto" }],
  },
});

// Storage for floor plans
const floorPlanStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "alrayahomes/floorplans",
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
  },
});

// Storage for category images
const categoryImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "alrayahomes/categories",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 600, height: 400, crop: "fill", quality: "auto" }],
  },
});

const uploadProjectImages = multer({
  storage: projectImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).array("images", 10);

const uploadFloorPlan = multer({
  storage: floorPlanStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single("floorPlan");

const uploadCategoryImage = multer({
  storage: categoryImageStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB
}).single("image");

// Delete image from Cloudinary
const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    console.error("Cloudinary delete error:", error);
  }
};

module.exports = {
  cloudinary,
  uploadProjectImages,
  uploadFloorPlan,
  uploadCategoryImage,
  deleteFromCloudinary,
};
