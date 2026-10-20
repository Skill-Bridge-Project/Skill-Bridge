
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "node:dns/promises";

import connectDB from "./src/config/db.js";
import sbRoutes from "./src/routes/sbRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Optional: helps with some MongoDB DNS resolution issues
dns.setServers(["1.1.1.1", "8.8.8.8"]);

app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// API health check
app.get("/", (req, res) => {
  res.status(200).json({
    app: "SkillBridge API",
    status: "running",
  });
});

// All SkillBridge routes
app.use("/api", sbRoutes);

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Central error handler
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: Object.values(err.errors)[0].message,
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid identifier supplied",
    });
  }

  res.status(err.status || 500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Server error"
        : err.message || "Server error",
  });
});

// Connect to MongoDB before starting Express
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        `SkillBridge API running on http://localhost:${PORT}`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to start SkillBridge:", err.message);
    process.exit(1);
  });