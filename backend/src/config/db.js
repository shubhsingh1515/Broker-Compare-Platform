const mongoose = require("mongoose");
const dns = require("node:dns");

// Use Cloudflare DNS (optional)
dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.MONGODB_URI ||
      "mongodb://127.0.0.1:27017/broker_compare_db";

    const conn = await mongoose.connect(mongoURI);

    console.log(`[MongoDB Connected]: ${conn.connection.host}`);
  } catch (error) {
    console.error("[MongoDB Connection Error]:", error);
    process.exit(1);
  }
};

module.exports = connectDB;