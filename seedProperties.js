require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("./config/cloudinary");
const Category = require("./model/Category");
const Project = require("./model/Project");

const PUBLIC_BASE = "D:/project/alrayahome/my-app/public";

async function uploadImages(folder, filenames) {
  const results = [];
  for (let i = 0; i < filenames.length; i++) {
    const localPath = `${PUBLIC_BASE}/${folder}/${filenames[i]}`;
    console.log(`  Uploading: ${localPath}`);
    const result = await cloudinary.uploader.upload(localPath, {
      folder: "alrayahomes/properties",
    });
    results.push({
      url: result.secure_url,
      public_id: result.public_id,
      isMain: i === 0,
    });
  }
  return results;
}

const propertiesData = [
  {
    categorySlug: "3-4-marla-economy",
    imageFolder: "3-4-marla-economy",
    imageFiles: ["exterior-classic.jpeg", "floor-plan.jpeg", "exterior-row.jpeg"],
    project: {
      title: "Al Raya Economy Home  3 & 4 Marla",
      shortDescription:
        "Affordable 2 & 3 bedroom homes ideal for small families  economy price, gated community",
      description:
        "Al Raya Homes presents the perfect economy housing solution for small families and first-time homeowners. Our 3 & 4 Marla homes are designed to maximize space efficiency without compromising on comfort. Each home features a clean modern exterior, fully painted interior, dedicated parking, and access to all community amenities. Located in gated societies across Pakistan with 24/7 security and free utilities connection.",
      type: "residential",
      location: { city: "Lahore", area: "Multiple Societies" },
      price: { label: "Price on Request" },
      size: { min: "3", max: "4", unit: "Marla" },
      amenities: [
        "24/7 Security",
        "Gated Community",
        "Electricity Connection",
        "Water Supply",
        "Gas Connection",
        "Parking Space",
        "Green Area",
      ],
      features: [
        "2-3 Bedrooms",
        "1-2 Bathrooms",
        "Kitchen",
        "Lounge",
        "Veranda",
        "Boundary Wall",
      ],
      paymentPlans: [
        {
          title: "Easy Installments",
          downPayment: "10% Advance",
          installment: "Rs. 500/day or Monthly",
          note: "Possession on advance payment",
        },
      ],
      status: "active",
      featured: true,
    },
  },
  {
    categorySlug: "5-marla-standard",
    imageFolder: "5-marla-standard",
    imageFiles: [
      "exterior-main.jpeg",
      "exterior-2.jpeg",
      "exterior-3.jpeg",
      "exterior-4.jpeg",
      "exterior-5.jpeg",
      "exterior-6.jpeg",
      "exterior-7.jpeg",
    ],
    project: {
      title: "Al Raya Standard Home  5 Marla",
      shortDescription:
        "Spacious 3-bed 5 Marla homes  modern design, ready to move, available across Pakistan",
      description:
        "Al Raya Homes 5 Marla Standard category offers beautifully designed double-storey homes with 3 bedrooms and 2 bathrooms. These homes feature contemporary architecture with large windows, quality flooring, fully fitted kitchen, and a private car porch. Built with high-quality materials and available in major cities across Pakistan. Perfect for medium-sized families seeking comfort and value.",
      type: "residential",
      location: { city: "Lahore", area: "Multiple Societies" },
      price: { label: "Price on Request" },
      size: { min: "5", max: "5", unit: "Marla" },
      amenities: [
        "24/7 Security",
        "Gated Community",
        "Car Porch",
        "Electricity",
        "Water",
        "Gas",
        "5G Internet",
        "Green Lawn",
      ],
      features: [
        "3 Bedrooms",
        "2 Bathrooms",
        "Modern Kitchen",
        "Living Room",
        "Dining Area",
        "Car Porch",
        "Balcony",
        "Roof Access",
      ],
      paymentPlans: [
        {
          title: "Standard Payment Plan",
          downPayment: "15% Down Payment",
          installment: "Monthly Installments",
          note: "Keys on possession",
        },
      ],
      status: "active",
      featured: true,
    },
  },
  {
    categorySlug: "5-marla-patent",
    imageFolder: "5-marla-patent",
    imageFiles: ["exterior-stone.jpeg", "exterior-classic.jpeg"],
    project: {
      title: "Al Raya Patent House  5 Marla",
      shortDescription:
        "Al Raya's signature patent design  stone & modern facade, premium finishing, unique architecture",
      description:
        "The Al Raya Patent House is our signature 5 Marla design  a proprietary architecture that blends natural stone cladding with modern construction. This is Al Raya Homes' most iconic design, featuring a premium stone-finished facade, glass balcony railing, wooden ceiling accent, and premium interior finishes. Each unit is a statement of style and quality. Available in classic white and stone variants.",
      type: "residential",
      location: { city: "Lahore", area: "Multiple Societies" },
      price: { label: "Price on Request" },
      size: { min: "5", max: "5", unit: "Marla" },
      amenities: [
        "24/7 Security",
        "Premium Gated Community",
        "Car Porch",
        "Glass Balcony",
        "Premium Flooring",
        "Electricity",
        "Water",
        "Gas",
        "5G Internet",
      ],
      features: [
        "3 Bedrooms",
        "2 Bathrooms",
        "Stone Cladding Facade",
        "Glass Railing Balcony",
        "Wooden Ceiling Accent",
        "Premium Kitchen",
        "Lounge",
        "Car Porch",
        "Boundary Wall & Gate",
      ],
      paymentPlans: [
        {
          title: "Patent House Payment Plan",
          downPayment: "20% Down Payment",
          installment: "Easy Monthly Installments",
          note: "Premium design, limited availability",
        },
      ],
      status: "active",
      featured: true,
    },
  },
  {
    categorySlug: "5-marla-luxury",
    imageFolder: "5-marla-luxury",
    imageFiles: [
      "exterior-main.jpeg",
      "exterior-2.jpeg",
      "exterior-3.jpeg",
      "exterior-4.jpeg",
      "exterior-5.jpeg",
      "exterior-6.jpeg",
    ],
    project: {
      title: "Al Raya Luxury Home  5 Marla Modern",
      shortDescription:
        "Premium luxury 5 Marla homes with car porch, palm garden and high-end finishes",
      description:
        "Al Raya Luxury 5 Marla homes represent the pinnacle of affordable luxury housing. These stunning properties feature classical European-inspired facades with large floor-to-ceiling windows, integrated car porch, lush landscaped garden with palm trees, and premium interior finishes throughout. Perfect for families who want a luxury lifestyle without the premium price tag of 10 Marla.",
      type: "residential",
      location: { city: "Lahore", area: "Multiple Premium Societies" },
      price: { label: "Price on Request" },
      size: { min: "5", max: "5", unit: "Marla" },
      amenities: [
        "Premium Security",
        "Luxury Gated Community",
        "Landscaped Garden",
        "Car Porch",
        "Premium Flooring",
        "All Utilities",
        "5G Internet",
        "Club House Access",
      ],
      features: [
        "3-4 Bedrooms",
        "2-3 Bathrooms",
        "Floor-to-Ceiling Windows",
        "Car Porch",
        "Palm Garden",
        "Premium Kitchen",
        "Drawing Room",
        "Balcony",
        "Roof Terrace",
      ],
      paymentPlans: [
        {
          title: "Luxury Payment Plan",
          downPayment: "25% Down Payment",
          installment: "Flexible Installments",
          note: "Luxury living at affordable price",
        },
      ],
      status: "active",
      featured: true,
    },
  },
  {
    categorySlug: "10-marla",
    imageFolder: "10-marla",
    imageFiles: [
      "exterior-modern.jpeg",
      "exterior-2.jpeg",
      "exterior-3.jpeg",
      "exterior-4.jpeg",
    ],
    project: {
      title: "Al Raya Patent House  10 Marla",
      shortDescription:
        "Al Raya's flagship 10 Marla patent house  contemporary design, premium interiors, spacious living",
      description:
        "Al Raya Homes presents the 10 Marla Patent House  our flagship product for families seeking spacious, modern living. This stunning contemporary home features an ultra-modern facade with large glass panels, premium entrance with steps and boundary wall, and a fully equipped interior. With 4-5 bedrooms, multiple living areas, and premium finishes throughout, this is the ideal family home. Available in multiple zones with varying price ranges.",
      type: "residential",
      location: { city: "Lahore", area: "Multiple Premium Zones" },
      price: { min: 29000000, max: 40000000, label: "Rs. 2.9 Cr  4.0 Cr" },
      size: { min: "10", max: "10", unit: "Marla" },
      amenities: [
        "24/7 Security",
        "Premium Gated Community",
        "Large Car Porch",
        "Manicured Garden",
        "All Premium Utilities",
        "5G Fiber Internet",
        "Club House",
        "Mosque",
        "Commercial Area",
      ],
      features: [
        "4-5 Bedrooms",
        "3-4 Bathrooms",
        "Modern Glass Facade",
        "Double Height Entrance",
        "Premium Kitchen",
        "Drawing Room",
        "Dining Room",
        "Servant Quarter",
        "Large Garden",
        "Roof Terrace",
      ],
      paymentPlans: [
        {
          title: "Zone A",
          downPayment: "Rs. 35,000,000 – 40,000,000",
        },
        {
          title: "Zone B",
          downPayment: "Rs. 31,000,000 – 34,500,000",
        },
        {
          title: "Zone C",
          downPayment: "Rs. 29,000,000 – 30,000,000",
        },
      ],
      status: "active",
      featured: true,
    },
  },
  {
    categorySlug: "2-bed-dd-lounge",
    imageFolder: "2-bed-dd-lounge",
    imageFiles: ["exterior-plan.jpeg"],
    project: {
      title: "2 Bed DD Lounge  Economy Complete Home",
      shortDescription:
        "Complete economy home with 2 bedrooms, double lounge, kitchen & veranda  best value for money",
      description:
        "Al Raya Homes 2 Bed DD Lounge is our most popular economy category  a complete, self-contained home with 2 bedrooms, a spacious double lounge, full kitchen, bathroom, and a charming veranda. This single-storey home is built on a practical floor plan designed for comfort and easy maintenance. Ideal for couples, small families, and daily wage earners who want their own home without the burden of a large loan.",
      type: "residential",
      location: { city: "Lahore", area: "Multiple Economy Societies" },
      price: { label: "Price on Request" },
      size: { min: "3", max: "4", unit: "Marla" },
      amenities: [
        "Gated Community",
        "Security",
        "Electricity",
        "Water",
        "Gas",
        "Veranda",
        "Parking",
      ],
      features: [
        "2 Bedrooms",
        "1 Bathroom",
        "Double Lounge (DD)",
        "Kitchen",
        "Veranda",
        "Boundary Wall",
        "Easy Access Gate",
      ],
      paymentPlans: [
        {
          title: "Rs. 500/Day Plan",
          downPayment: "Small Advance",
          installment: "Rs. 500 per day",
          note: "Get keys on advance  pay daily or weekly",
        },
      ],
      status: "active",
      featured: true,
    },
  },
  {
    categorySlug: "villas-2-4-kanal",
    imageFolder: "villas",
    imageFiles: [
      "villa-1.jpeg",
      "villa-2.jpeg",
      "villa-3.jpeg",
      "villa-4.jpeg",
      "villa-5.jpeg",
      "villa-6.jpeg",
      "villa-7.jpeg",
      "villa-8.jpeg",
    ],
    project: {
      title: "Al Raya Villas  2 to 4 Kanal",
      shortDescription:
        "Premium Al Raya Villas from 2 to 4 Kanal  luxury living with private pool, solar & scenic locations",
      description:
        "Al Raya Homes Villas represent the ultimate in luxury living. Available from 2 to 4 Kanal, these magnificent properties offer everything a discerning family could desire  private swimming pools, solar panel roofing, expansive outdoor deck terraces, panoramic views, and premium interiors. Each villa is individually designed and available at multiple scenic locations across Pakistan. Contact us for pricing and availability.",
      type: "villa",
      location: { city: "Multiple Cities", area: "Multiple Premium Locations" },
      price: { label: "Price on Request  Contact Us" },
      size: { min: "2", max: "4", unit: "Kanal" },
      amenities: [
        "Private Swimming Pool",
        "Solar Panel System",
        "Premium Security",
        "Outdoor Deck",
        "Landscaped Garden",
        "All Utilities",
        "Smart Home System",
        "Servant Quarters",
        "Multiple Parking",
      ],
      features: [
        "5-7 Bedrooms",
        "4-5 Bathrooms",
        "Private Pool",
        "Solar Roofing",
        "Outdoor Deck Terrace",
        "Panoramic Views",
        "Modern Open Kitchen",
        "Home Theater",
        "Gym Room",
        "Guest Suite",
      ],
      paymentPlans: [
        {
          title: "Villa Payment Plan",
          downPayment: "30% Down Payment",
          installment: "Negotiable Installments",
          note: "Multiple locations  prices vary by location and size",
        },
      ],
      status: "active",
      featured: true,
    },
  },
];

const categoriesData = [
  { name: "3-4 Marla Economy", slug: "3-4-marla-economy", description: "Affordable 3 & 4 Marla economy homes", icon: "🏠", order: 1 },
  { name: "5 Marla Standard", slug: "5-marla-standard", description: "5 Marla standard homes", icon: "🏡", order: 2 },
  { name: "5 Marla Patent", slug: "5-marla-patent", description: "Al Raya signature patent design homes", icon: "⭐", order: 3 },
  { name: "5 Marla Luxury", slug: "5-marla-luxury", description: "Premium luxury 5 Marla homes", icon: "💎", order: 4 },
  { name: "10 Marla", slug: "10-marla", description: "Flagship 10 Marla patent homes", icon: "🏛️", order: 5 },
  { name: "2 Bed DD Lounge", slug: "2-bed-dd-lounge", description: "Economy 2 bedroom homes with double lounge", icon: "🛏️", order: 6 },
  { name: "Villas 2-4 Kanal", slug: "villas-2-4-kanal", description: "Premium villas from 2 to 4 Kanal", icon: "🏰", order: 7 },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    // Create categories if they don't exist
    console.log("\nEnsuring categories exist...");
    for (const catData of categoriesData) {
      const existing = await Category.findOne({ slug: catData.slug });
      if (!existing) {
        await Category.create(catData);
        console.log(`  Created category: ${catData.name}`);
      } else {
        console.log(`  Category exists: ${catData.name}`);
      }
    }

    for (const item of propertiesData) {
      console.log(`\nProcessing: ${item.project.title}`);

      // Find category
      const category = await Category.findOne({ slug: item.categorySlug });
      if (!category) {
        console.warn(`  WARNING: Category not found for slug: ${item.categorySlug}  skipping`);
        continue;
      }
      console.log(`  Found category: ${category.name}`);

      // Check if project already exists
      const existing = await Project.findOne({ title: item.project.title });
      if (existing) {
        console.log(`  Already exists  skipping`);
        continue;
      }

      // Upload images
      console.log(`  Uploading ${item.imageFiles.length} images...`);
      const images = await uploadImages(item.imageFolder, item.imageFiles);

      // Create project
      const projectData = {
        ...item.project,
        category: category._id,
        images,
        developerName: "Al Raya Homes",
      };

      const project = await Project.create(projectData);
      console.log(`  Created project: ${project.title} (${project.slug})`);
    }

    console.log("\nSeeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err);
    process.exit(1);
  }
}

seed();
