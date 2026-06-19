require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./model/User");

const ADMIN_NAME = "Al Raya Admin";
const ADMIN_EMAIL = "admin@alrayahomes.com";
const ADMIN_PASSWORD = "AlRaya@2024";

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log("Admin already exists:", ADMIN_EMAIL);
    process.exit(0);
  }

  await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
  });

  console.log("✓ Admin created successfully");
  console.log("  Email:   ", ADMIN_EMAIL);
  console.log("  Password:", ADMIN_PASSWORD);
  process.exit(0);
}

createAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
