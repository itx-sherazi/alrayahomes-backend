require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRouter = require("./router/authRouter");
const categoryRouter = require("./router/categoryRouter");
const projectRouter = require("./router/projectRouter");
const leadRouter = require("./router/leadRouter");
const userRouter = require("./router/userRouter");

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  "http://localhost:3000",
  "https://alrayahomes.com",
  "https://www.alrayahomes.com",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Al Raya Homes API is running", env: process.env.NODE_ENV });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/projects", projectRouter);
app.use("/api/leads", leadRouter);
app.use("/api/users", userRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

// Local dev server (not used on Vercel)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
