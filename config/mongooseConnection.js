// db.js
const mongoose = require("mongoose");
const config = require("config");
const dbgr = require("debug")("development:mongoose");

async function connectDB() {
  try {
    const uri = `${config.get("MONGODB_URI")}/ecommerce`;
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
    });
    dbgr("✅ Connected to MongoDB");
  } catch (err) {
    dbgr("❌ MongoDB connection error:", err.message);
    process.exit(1); // stop server if db failed
  }
}

module.exports = { connectDB, connection: mongoose.connection };