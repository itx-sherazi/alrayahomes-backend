require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("./model/Category");

const categories = [
  {
    name: "3 & 4 Marla Economy",
    slug: "3-4-marla-economy",
    description: "Affordable economy homes in 3 & 4 Marla  2 & 3 bed, perfect for small families on a budget.",
    icon: "home",
    order: 1,
  },
  {
    name: "5 Marla Standard",
    slug: "5-marla-standard",
    description: "Al Raya Homes 5 Marla economy houses  spacious, comfortable and available across Pakistan.",
    icon: "home-modern",
    order: 2,
  },
  {
    name: "5 Marla Patent House",
    slug: "5-marla-patent",
    description: "Al Raya Patent House  unique 5 Marla design, fully furnished and move-in ready.",
    icon: "shield-check",
    order: 3,
  },
  {
    name: "5 Marla Luxury & Modern",
    slug: "5-marla-luxury",
    description: "5 Marla modern architect townhouses and luxury category  premium finishes, contemporary design.",
    icon: "sparkles",
    order: 4,
  },
  {
    name: "10 Marla",
    slug: "10-marla",
    description: "Al Raya Homes 10 Marla Patent House  modern interior & exterior, economy and premium options.",
    icon: "building-office-2",
    order: 5,
  },
  {
    name: "2 Bed DD Lounge Economy",
    slug: "2-bed-dd-lounge",
    description: "2 Bed DD Lounge  complete economy price best home, ideal for couples and small families.",
    icon: "users",
    order: 6,
  },
  {
    name: "Villas 2-4 Kanal",
    slug: "villas-2-4-kanal",
    description: "Al Raya Homes Villas  premium 2 to 4 Kanal villas available at multiple locations across Pakistan.",
    icon: "trophy",
    order: 7,
  },
];

async function seedCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    // Remove existing categories
    await Category.deleteMany({});
    console.log("Old categories cleared");

    // Insert new
    const inserted = await Category.insertMany(categories);
    console.log(`✅ ${inserted.length} categories seeded:`);
    inserted.forEach((c) => console.log(`   - ${c.name} (${c.slug})`));

    await mongoose.disconnect();
    console.log("Done.");
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

seedCategories();
