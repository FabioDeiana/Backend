const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const connectDB = require("./src/config/db");
connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// Routes
const authRoutes = require("./src/routes/authRoutes");
const activityRoutes = require("./src/routes/activityRoutes");
app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);

const reviewRoutes = require("./src/routes/reviewRoutes");
app.use("/api/activities/:activityId/reviews", reviewRoutes);

const menuRoutes = require("./src/routes/menuRoutes");
app.use("/api/activities/:activityId/menu", menuRoutes);

const newsletterRoutes = require("./src/routes/newsletterRoutes");
app.use("/api/newsletter", newsletterRoutes);

const chatRoutes = require("./src/routes/chatRoutes");
app.use("/api/chat", chatRoutes);

const adminRoutes = require("./src/routes/adminRoutes");
app.use("/api/admin", adminRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({ message: "OpenPlaces API running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});