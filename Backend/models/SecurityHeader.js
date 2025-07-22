const mongoose = require("mongoose");

const securityHeaderSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("SecurityHeader", securityHeaderSchema);