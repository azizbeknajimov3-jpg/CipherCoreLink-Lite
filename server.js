// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// .env fayldan config
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// MongoDB ulanishi
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB ulandi"))
  .catch((err) => console.error("❌ MongoDB xatosi:", err));

// ROUTES
app.get("/", (req, res) => {
  res.send("🚀 CipherCoreLink birlashtirilgan server ishlayapti!");
});

// Modular routes
const userRoutes = require("./routes/userRoutes");
const aiRoutes = require("./routes/aiRoutes");

app.use("/api/users", userRoutes);
app.use("/api/ai", aiRoutes);

// Static frontend build
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌍 Server ${PORT}-portda ishlayapti`));