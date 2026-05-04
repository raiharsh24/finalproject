const errorHandler = require("./middleware/errorHandler");
require('dotenv').config({ path: __dirname + '/.env' });

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");

/* ================== DISABLE BUFFERING (FIX TIMEOUT ERROR) ================== */
mongoose.set("bufferCommands", false);

/* ================== INIT APP ================== */
const app = express();

/* ================== MIDDLEWARE ================== */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

/* ================== DB CONNECTION ================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Error:", err));

/* 🔥 CONNECTION EVENTS (VERY IMPORTANT) */
mongoose.connection.on("connected", () => {
  console.log("🟢 Mongoose connected");
});

mongoose.connection.on("error", (err) => {
  console.log("🔴 Mongoose error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected");
});

/* ================== ROUTES ================== */
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const aiRoute = require("./routes/aiRoute");
const runCodeRoutes = require("./routes/runCode");

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/ai", aiRoute);
app.use("/api/code", runCodeRoutes);

/* ================== HEALTH CHECK ================== */
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

/* ================== 404 ================== */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ✅ CUSTOM ERROR HANDLER (LAST)
app.use(errorHandler);

/* ================== START SERVER ================== */
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Kill the existing process or change PORT.`);
    process.exit(1);
  }
  throw err;
});

process.on("SIGINT", () => {
  console.log("⚠️ Shutting down gracefully...");
  mongoose.disconnect().finally(() => process.exit(0));
});