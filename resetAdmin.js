require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./model/User");

const ADMIN_EMAIL = "admin@alrayahomes.com";
const ADMIN_PASSWORD = "AlRaya@2024";

async function resetAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await User.deleteOne({ email: ADMIN_EMAIL });
  console.log("Old admin deleted");

  const user = await User.create({
    name: "Al Raya Admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
  });

  console.log("✓ Admin recreated:", user.email, "| role:", user.role);
  process.exit(0);
}

resetAdmin().catch((err) => {
  console.error(err);
  process.exit(1);
});
