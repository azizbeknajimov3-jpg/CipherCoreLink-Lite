// server.js
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// .env fayldan o‘qish
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

// Oddiy model misoli
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model("User", UserSchema);

// API routes
app.get("/", (req, res) => {
  res.send("🚀 CipherCoreLink server ishlayapti!");
});

// Yangi user qo‘shish
app.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.json({ message: "User qo‘shildi!", user: newUser });
  } catch (err) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// Userlarni olish
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server xatosi" });
  }
});

// Static frontend buildni ulash
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// Serverni ishga tushirish
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🌍 Server ${PORT}-portda ishlayapti`));