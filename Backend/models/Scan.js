const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
  domain: String,
  ip: String,
  headers: Object,
  grade: String,
  scannedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Scan", scanSchema);