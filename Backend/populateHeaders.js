const mongoose = require("mongoose");
const dotenv = require("dotenv");
const SecurityHeader = require("./models/SecurityHeader");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const headers = [
  "strict-transport-security",
  "content-security-policy",
  "x-frame-options",
  "x-content-type-options",
  "referrer-policy",
  "permissions-policy",
  "x-xss-protection",
  "cross-origin-embedder-policy",
  "cross-origin-resource-policy"
];

async function seedHeaders() {
  await SecurityHeader.deleteMany();
  await SecurityHeader.insertMany(headers.map(h => ({ name: h })));
  console.log("✅ Headers inserted");
  process.exit();
}

seedHeaders();