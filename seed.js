require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ── Models ─────────────────────────────────────────────────────────────────
const User = require("./model/User");
const Category = require("./model/Category");
const Project = require("./model/Project");
const Lead = require("./model/Lead");

// ── Seed Data ──────────────────────────────────────────────────────────────

const users = [
  {
    name: "Super Admin",
    email: "admin@alrayahomes.com",
    phone: "+92 304 4169069",
    password: "Admin@123",
    role: "admin",
    isActive: true,
  },
  {
    name: "Ahmed Ali",
    email: "ahmed@gmail.com",
    phone: "+92 321 1234567",
    password: "User@123",
    role: "user",
    isActive: true,
  },
  {
    name: "Fatima Khan",
    email: "fatima@gmail.com",
    phone: "+92 300 9876543",
    password: "User@123",
    role: "user",
    isActive: true,
  },
];

const categories = [
  { name: "Residential", slug: "residential", description: "Comfortable homes for families", icon: "home", order: 1 },
  { name: "Commercial", slug: "commercial", description: "Office spaces and shops", icon: "building", order: 2 },
  { name: "Apartments", slug: "apartments", description: "Modern apartment living", icon: "apartment", order: 3 },
  { name: "Villas", slug: "villas", description: "Luxury villa properties", icon: "villa", order: 4 },
  { name: "Townhouses", slug: "townhouses", description: "Community townhouse living", icon: "townhouse", order: 5 },
  { name: "Investment", slug: "investment", description: "High return investment properties", icon: "investment", order: 6 },
];

// ── Main Seed Function ─────────────────────────────────────────────────────
const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Project.deleteMany({}),
      Lead.deleteMany({}),
    ]);
    console.log("🗑️  Cleared existing data");

    // ── Seed Users ──────────────────────────────────────────────────────────
    const createdUsers = [];
    for (const u of users) {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(u.password, salt);
      const user = await User.create({ ...u, password: hashed });
      createdUsers.push(user);
    }
    const adminUser = createdUsers[0];
    const user1 = createdUsers[1];
    const user2 = createdUsers[2];
    console.log(`👤 Created ${createdUsers.length} users`);
    console.log(`   Admin: ${adminUser.email} / Admin@123`);
    console.log(`   User1: ${user1.email} / User@123`);
    console.log(`   User2: ${user2.email} / User@123`);

    // ── Seed Categories ─────────────────────────────────────────────────────
    const createdCats = await Category.insertMany(categories);
    const catMap = {};
    createdCats.forEach((c) => { catMap[c.slug] = c._id; });
    console.log(`🏷️  Created ${createdCats.length} categories`);

    // ── Seed Projects ───────────────────────────────────────────────────────
    // Note: insertMany skips middleware, so slugs are provided explicitly
    const projects = [
      {
        title: "Al Raya Garden Heights",
        slug: "al-raya-garden-heights",
        description: `Al Raya Garden Heights is a premium residential community located in the heart of Lahore. Designed for families who value comfort, space, and a peaceful lifestyle, this project offers a perfect blend of modern architecture and natural surroundings.\n\nOur spacious plots and beautifully designed homes cater to middle-class families seeking affordable yet high-quality housing without compromising on their lifestyle.\n\nWith 24/7 security, wide carpeted roads, underground utilities, and a dedicated community park, Al Raya Garden Heights sets a new standard for residential living in Punjab.`,
        shortDescription: "Premium residential community in Lahore with modern amenities and affordable pricing.",
        category: catMap["residential"],
        type: "residential",
        location: { city: "Lahore", area: "Bahria Town Adjacent", address: "Ring Road, Lahore" },
        price: { min: 4500000, max: 12000000, label: "PKR 45 Lakh – 1.2 Crore" },
        size: { min: "3", max: "10", unit: "Marla" },
        images: [
          { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800", public_id: "seed_img_1", isMain: true, caption: "Main entrance" },
          { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", public_id: "seed_img_2", isMain: false, caption: "Community view" },
          { url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800", public_id: "seed_img_3", isMain: false, caption: "Interior" },
        ],
        amenities: ["24/7 Security", "Carpeted Roads", "Underground Utilities", "Community Park", "Mosque", "School", "Shopping Area", "Water Supply", "Gas Supply", "Street Lights"],
        features: ["Corner Plots Available", "Easy Installments", "3 Years Payment Plan", "Possession on 50% Payment"],
        paymentPlans: [
          { title: "3 Year Easy Plan", downPayment: "25%", installment: "Quarterly", duration: "3 Years", note: "5% discount on full payment" },
          { title: "5 Year Extended Plan", downPayment: "15%", installment: "Monthly", duration: "5 Years", note: "Available for 5 Marla only" },
        ],
        status: "active",
        featured: true,
        developerName: "Al Raya Homes (Treeland Builders)",
        completionDate: "December 2025",
        totalUnits: 500,
        availableUnits: 320,
        createdBy: adminUser._id,
      },
      {
        title: "Al Raya Executive Apartments",
        slug: "al-raya-executive-apartments",
        description: `Al Raya Executive Apartments brings world-class apartment living to Islamabad at an affordable price. Located in a prime location with easy access to all major areas, these apartments are ideal for young professionals, small families, and investors.\n\nEach apartment is designed with modern finishes, open floor plans, and large windows offering stunning views. The building features a rooftop lounge, underground parking, and 24/7 concierge service.\n\nThis is Al Raya Homes' first American-style apartment community in Pakistan.`,
        shortDescription: "Modern apartments in Islamabad — American-style community living at affordable prices.",
        category: catMap["apartments"],
        type: "apartment",
        location: { city: "Islamabad", area: "G-13", address: "G-13/1, Islamabad" },
        price: { min: 6500000, max: 15000000, label: "PKR 65 Lakh – 1.5 Crore" },
        size: { min: "850", max: "1400", unit: "Sq Ft" },
        images: [
          { url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", public_id: "seed_apt_1", isMain: true, caption: "Building exterior" },
          { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800", public_id: "seed_apt_2", isMain: false, caption: "Living room" },
          { url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", public_id: "seed_apt_3", isMain: false, caption: "Bedroom" },
        ],
        floorPlans: [
          { title: "1 Bedroom Apartment", image: { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", public_id: "fp_1" }, bedrooms: 1, bathrooms: 1, area: "850 Sq Ft" },
          { title: "2 Bedroom Apartment", image: { url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", public_id: "fp_2" }, bedrooms: 2, bathrooms: 2, area: "1200 Sq Ft" },
        ],
        amenities: ["Rooftop Lounge", "Underground Parking", "24/7 Concierge", "Gym", "CCTV Security", "Backup Generator", "High-Speed Elevator", "Laundry Service"],
        features: ["American-Style Design", "Smart Home Ready", "High-Speed Internet", "Central AC"],
        paymentPlans: [
          { title: "Booking Plan", downPayment: "20%", installment: "Monthly (48 months)", duration: "4 Years", note: "Possession on 60% payment" },
        ],
        status: "active",
        featured: true,
        developerName: "Al Raya Homes (Treeland Builders)",
        completionDate: "June 2026",
        totalUnits: 120,
        availableUnits: 85,
        createdBy: adminUser._id,
      },
      {
        title: "Village Garden Homes — Sahiwal",
        slug: "village-garden-homes-sahiwal",
        description: `Village Garden Homes is Al Raya Homes' flagship project aimed at bringing international housing standards to rural Pakistan. Located in Sahiwal, this project transforms traditional village living into a modern, well-planned community.\n\nEach home is designed with a garden, proper drainage system, and all modern facilities including gas, electricity, and clean water. The community has a dedicated school, mosque, and health center.\n\nThis is affordable housing done right — dignity and quality for every Pakistani family regardless of their location.`,
        shortDescription: "International-standard homes in Sahiwal — village living reimagined with modern facilities.",
        category: catMap["residential"],
        type: "residential",
        location: { city: "Sahiwal", area: "Main Sahiwal Road", address: "Sahiwal Bypass, Punjab" },
        price: { min: 1800000, max: 4500000, label: "PKR 18 Lakh – 45 Lakh" },
        size: { min: "3", max: "5", unit: "Marla" },
        images: [
          { url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800", public_id: "seed_vg_1", isMain: true, caption: "Village Garden Homes" },
          { url: "https://images.unsplash.com/photo-1501183638710-841dd1904471?w=800", public_id: "seed_vg_2", isMain: false, caption: "Community park" },
        ],
        amenities: ["Community Garden", "Mosque", "School", "Health Center", "Clean Water", "Gas Supply", "Sewerage System", "Street Lights"],
        features: ["Most Affordable in Region", "3 Marla & 5 Marla Options", "Ready to Move", "Garden with Every Home"],
        paymentPlans: [
          { title: "Affordable Plan", downPayment: "10%", installment: "Monthly (60 months)", duration: "5 Years", note: "Lowest monthly installment in region" },
        ],
        status: "active",
        featured: true,
        developerName: "Al Raya Homes (Treeland Builders)",
        completionDate: "March 2025",
        totalUnits: 800,
        availableUnits: 450,
        createdBy: adminUser._id,
      },
      {
        title: "Al Raya Business Hub",
        slug: "al-raya-business-hub",
        description: `Al Raya Business Hub is a state-of-the-art commercial project in Faisalabad designed for businesses, offices, and retail shops. Strategically located on the main commercial corridor, this project offers excellent visibility and footfall.\n\nThe building features modern office spaces, retail shops on ground floor, dedicated parking, and 24/7 security. Ideal for businesses looking for a professional environment at competitive prices.`,
        shortDescription: "Premium commercial spaces in Faisalabad — offices, shops, and investment opportunities.",
        category: catMap["commercial"],
        type: "commercial",
        location: { city: "Faisalabad", area: "Susan Road", address: "Susan Road, D-Ground, Faisalabad" },
        price: { min: 8000000, max: 25000000, label: "PKR 80 Lakh – 2.5 Crore" },
        size: { min: "200", max: "1000", unit: "Sq Ft" },
        images: [
          { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800", public_id: "seed_bh_1", isMain: true, caption: "Business Hub exterior" },
          { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", public_id: "seed_bh_2", isMain: false, caption: "Office interior" },
        ],
        amenities: ["High-Speed Elevators", "Backup Power", "Dedicated Parking", "Security System", "Conference Rooms", "Cafeteria", "Prayer Room"],
        features: ["Prime Location", "Ready Offices", "Flexible Sizes", "Investment Grade"],
        paymentPlans: [
          { title: "Commercial Plan", downPayment: "30%", installment: "Quarterly", duration: "3 Years", note: "High rental yield expected" },
        ],
        status: "active",
        featured: false,
        developerName: "Al Raya Homes (Treeland Builders)",
        completionDate: "September 2025",
        totalUnits: 80,
        availableUnits: 45,
        createdBy: adminUser._id,
      },
      {
        title: "Al Raya Villas — Gujranwala",
        slug: "al-raya-villas-gujranwala",
        description: `Al Raya Villas offers luxurious villa living in Gujranwala at surprisingly affordable prices. These three-story villas are designed for extended families who value both privacy and community.\n\nEach villa comes with a private garden, 4 bedrooms, servant quarters, and a rooftop terrace. The gated community offers round-the-clock security, a clubhouse, and a swimming pool.`,
        shortDescription: "Luxury 3-story villas in Gujranwala — premium living for extended families.",
        category: catMap["villas"],
        type: "villa",
        location: { city: "Gujranwala", area: "GT Road Adjacent", address: "Near Gujranwala Cantt" },
        price: { min: 18000000, max: 35000000, label: "PKR 1.8 Crore – 3.5 Crore" },
        size: { min: "10", max: "20", unit: "Marla" },
        images: [
          { url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800", public_id: "seed_vl_1", isMain: true, caption: "Villa exterior" },
          { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800", public_id: "seed_vl_2", isMain: false, caption: "Living area" },
        ],
        amenities: ["Private Garden", "Rooftop Terrace", "Swimming Pool", "Clubhouse", "Servant Quarters", "Double Garage", "CCTV Security", "Gated Community"],
        features: ["4 Bedrooms", "3 Bathrooms", "3-Story Design", "Premium Finishes"],
        paymentPlans: [
          { title: "Villa Payment Plan", downPayment: "35%", installment: "Quarterly (8 installments)", duration: "2 Years", note: "Possession on 70% payment" },
        ],
        status: "active",
        featured: true,
        developerName: "Al Raya Homes (Treeland Builders)",
        completionDate: "December 2026",
        totalUnits: 50,
        availableUnits: 28,
        createdBy: adminUser._id,
      },
      {
        title: "Al Raya Townhouses — Multan",
        slug: "al-raya-townhouses-multan",
        description: `Al Raya Townhouses in Multan brings a new concept of community living — American-style townhouses with shared amenities but private spaces. These 2-bedroom and 3-bedroom units are perfect for small families and young couples.\n\nEach townhouse has its own entrance, parking, and small courtyard. The community features a central park, kids play area, and a community hall.`,
        shortDescription: "Modern townhouses in Multan — 1 & 2 bedroom units with community living concept.",
        category: catMap["townhouses"],
        type: "townhouse",
        location: { city: "Multan", area: "Bosan Road", address: "Bosan Road, Multan" },
        price: { min: 3500000, max: 7500000, label: "PKR 35 Lakh – 75 Lakh" },
        size: { min: "700", max: "1100", unit: "Sq Ft" },
        images: [
          { url: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800", public_id: "seed_th_1", isMain: true, caption: "Townhouse row" },
          { url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800", public_id: "seed_th_2", isMain: false, caption: "Interior" },
        ],
        amenities: ["Community Park", "Kids Play Area", "Community Hall", "CCTV Security", "Water & Gas", "Ample Parking"],
        features: ["1 & 2 Bedroom Options", "Private Courtyard", "Dedicated Parking", "Easy Access"],
        paymentPlans: [
          { title: "Easy Monthly Plan", downPayment: "20%", installment: "Monthly (48 months)", duration: "4 Years", note: "No hidden charges" },
        ],
        status: "active",
        featured: false,
        developerName: "Al Raya Homes (Treeland Builders)",
        completionDate: "August 2025",
        totalUnits: 200,
        availableUnits: 130,
        createdBy: adminUser._id,
      },
      {
        title: "Al Raya Investment Plots — Karachi",
        slug: "al-raya-investment-plots-karachi",
        description: `Al Raya Investment Plots in Karachi offer the best ROI in the city. Located in a rapidly developing area with excellent infrastructure, these commercial and residential plots are ideal for investors looking for long-term appreciation.\n\nWith Karachi's growing demand for quality housing and commercial spaces, these plots are expected to appreciate 3x within 5 years. Al Raya provides complete documentation and hassle-free possession.`,
        shortDescription: "High-yield investment plots in Karachi — residential and commercial options available.",
        category: catMap["investment"],
        type: "investment",
        location: { city: "Karachi", area: "Scheme 33", address: "Scheme 33, Super Highway, Karachi" },
        price: { min: 2500000, max: 20000000, label: "PKR 25 Lakh – 2 Crore" },
        size: { min: "120", max: "500", unit: "Sq Yards" },
        images: [
          { url: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800", public_id: "seed_inv_1", isMain: true, caption: "Investment area" },
        ],
        amenities: ["Clear Title", "Approved Layout Plan", "Boundary Wall", "Access Roads", "Utilities Available"],
        features: ["High ROI Area", "Rapid Development", "Flexible Sizes", "Easy Documentation"],
        paymentPlans: [
          { title: "Investor Plan", downPayment: "40%", installment: "Quarterly", duration: "2 Years", note: "Expected 200-300% appreciation in 5 years" },
        ],
        status: "active",
        featured: false,
        developerName: "Al Raya Homes (Treeland Builders)",
        completionDate: "Ready Possession",
        totalUnits: 300,
        availableUnits: 180,
        createdBy: adminUser._id,
      },
      {
        title: "Al Raya Heights — Islamabad (Upcoming)",
        slug: "al-raya-heights-islamabad-upcoming",
        description: `Al Raya Heights is our upcoming flagship luxury project in Islamabad — a 20-story high-rise offering panoramic views of the Margalla Hills. Pre-launch bookings are now open at special early-bird prices.\n\nThis will be Al Raya Homes' most ambitious project yet, featuring a mix of residential apartments, serviced suites, and retail spaces. World-class amenities including a rooftop infinity pool, spa, and sky lounge.`,
        shortDescription: "Upcoming luxury high-rise in Islamabad — pre-launch bookings open now.",
        category: catMap["apartments"],
        type: "apartment",
        location: { city: "Islamabad", area: "Blue Area", address: "Jinnah Avenue, Blue Area, Islamabad" },
        price: { min: 12000000, max: 50000000, label: "PKR 1.2 Crore – 5 Crore" },
        size: { min: "900", max: "3000", unit: "Sq Ft" },
        images: [
          { url: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800", public_id: "seed_uh_1", isMain: true, caption: "Artist impression" },
        ],
        amenities: ["Rooftop Infinity Pool", "Spa & Wellness Center", "Sky Lounge", "Concierge Service", "Valet Parking", "Smart Home System"],
        features: ["Pre-Launch Prices", "Early Bird Discount 15%", "Premium Location", "Panoramic Views"],
        paymentPlans: [
          { title: "Pre-Launch Plan", downPayment: "10%", installment: "On milestone", duration: "3 Years construction", note: "15% discount for pre-launch bookings" },
        ],
        status: "upcoming",
        featured: true,
        developerName: "Al Raya Homes (Treeland Builders)",
        completionDate: "2028",
        totalUnits: 200,
        availableUnits: 200,
        createdBy: adminUser._id,
      },
    ];

    const createdProjects = await Project.insertMany(projects);
    console.log(`🏠 Created ${createdProjects.length} projects`);

    // ── Seed Leads ──────────────────────────────────────────────────────────
    const leads = [
      { name: "Muhammad Hassan", phone: "+92 312 1111111", email: "hassan@gmail.com", message: "I am interested in 5 Marla plot in Al Raya Garden Heights. Please share payment plan details.", project: createdProjects[0]._id, type: "inquiry", status: "new", source: "website" },
      { name: "Ayesha Siddiqui", phone: "+92 333 2222222", email: "ayesha@gmail.com", message: "Looking for 2 bedroom apartment in Islamabad. Budget 1 Crore. Please call.", project: createdProjects[1]._id, type: "callback", status: "contacted", source: "website" },
      { name: "Bilal Ahmed", phone: "+92 345 3333333", email: "", message: "Want to visit Village Garden Homes site. Please arrange a visit this weekend.", project: createdProjects[2]._id, type: "inquiry", status: "new", source: "whatsapp" },
      { name: "Zainab Malik", phone: "+92 321 4444444", email: "zainab@hotmail.com", message: "Interested in commercial space in Business Hub. Need details on available units.", project: createdProjects[3]._id, type: "inquiry", status: "converted", source: "website" },
      { name: "Usman Tariq", phone: "+92 300 5555555", email: "usman@gmail.com", message: "Looking to invest in Karachi plots. Interested in 5 plots for investment purpose.", project: createdProjects[6]._id, type: "inquiry", status: "new", source: "website" },
      { name: "Sara Nawaz", phone: "+92 315 6666666", email: "sara@gmail.com", message: "Pre-launch booking for Al Raya Heights. Want early bird discount information.", project: createdProjects[7]._id, type: "inquiry", status: "contacted", source: "website" },
      { name: "Kamran Hussain", phone: "+92 323 7777777", email: "", message: "Interested in townhouse in Multan. Please WhatsApp details.", project: createdProjects[5]._id, type: "whatsapp", status: "new", source: "whatsapp" },
      { name: "Nadia Ashraf", phone: "+92 347 8888888", email: "nadia@gmail.com", message: "Looking for villa in Gujranwala. Need complete brochure.", project: createdProjects[4]._id, type: "inquiry", status: "rejected", source: "website" },
      { name: "Tariq Mehmood", phone: "+92 301 9999999", email: "tariq@gmail.com", message: "General inquiry about Al Raya Homes projects in Punjab. Need full portfolio.", project: null, type: "contact", status: "new", source: "website" },
      { name: "Hina Baig", phone: "+92 311 0000000", email: "hina@gmail.com", message: "Referred by friend. Want to book in Garden Heights. Please call urgently.", project: createdProjects[0]._id, type: "callback", status: "contacted", source: "referral" },
    ];

    await Lead.insertMany(leads);
    console.log(`📋 Created ${leads.length} leads`);

    // ── Summary ─────────────────────────────────────────────────────────────
    console.log("\n══════════════════════════════════════════════");
    console.log("✅  DATABASE SEEDED SUCCESSFULLY");
    console.log("══════════════════════════════════════════════");
    console.log("\n🔑  Login Credentials:");
    console.log("   Admin  → admin@alrayahomes.com / Admin@123");
    console.log("   User 1 → ahmed@gmail.com / User@123");
    console.log("   User 2 → fatima@gmail.com / User@123");
    console.log("\n📊  Data Summary:");
    console.log(`   Users      : ${createdUsers.length} (1 admin + 2 users)`);
    console.log(`   Categories : ${createdCats.length}`);
    console.log(`   Projects   : ${createdProjects.length} (7 active, 1 upcoming)`);
    console.log(`   Leads      : ${leads.length}`);
    console.log("\n🌐  Frontend: http://localhost:3000");
    console.log("🔧  Backend:  http://localhost:5000/api/health");
    console.log("══════════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed Error:", error.message);
    process.exit(1);
  }
};

seed();
