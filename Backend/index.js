const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dns = require("dns");
const { promisify } = require("util");
const Scan = require("./models/Scan");
const SecurityHeader = require("./models/SecurityHeader");
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
mongoose.connect(process.env.MONGO_URI);

const resolveIp = promisify(dns.lookup);

app.post("/api/scan", async (req, res) => {
  const { domain } = req.body;
  if (!domain || !/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
    return res.status(400).json({ error: "Invalid or empty domain name." });
  }

  try {
    const headerDocs = await SecurityHeader.find();
    const securityHeadersList = headerDocs.map(h => h.name);

    const response = await fetch(`https://${domain}`);
    const headersRaw = response.headers.raw();
    const headers = {};

    securityHeadersList.forEach((header) => {
      headers[header] = headersRaw[header] ? true : false;
    });

    const passed = Object.values(headers).filter(Boolean).length;
    const grade = passed >= 8 ? "A+" : passed >= 6 ? "A" : passed >= 4 ? "B" : passed >= 2 ? "C" : "F";
    const { address: ip } = await resolveIp(domain);

    await Scan.findOneAndUpdate(
      { domain },
      { domain, headers, ip, grade, scannedAt: new Date() },
      { upsert: true, new: true }
    );

    res.json({ headers, grade, domain: `https://${domain}`, ip, time: new Date().toISOString() });
  } catch (err) {
    res.status(400).json({ error: "Failed to scan" });
  }
});

app.get("/api/recent", async (req, res) => {
  const all = await Scan.find().sort({ scannedAt: -1 });
  const unique = [...new Map(all.map(scan => [scan.domain, scan])).values()].slice(0, 10);
  res.json(unique);
});

app.get("/api/hall", async (req, res) => {
  const all = await Scan.find();

  const fame = [...new Map(
    all.filter((s) => s.grade === "A" || s.grade === "A+")
      .sort((a, b) => b.grade.localeCompare(a.grade))
      .map((item) => [item.domain, item])
  ).values()];

  const shame = [...new Map(
    all.filter((s) => s.grade === "F" || s.grade === "D")
      .sort((a, b) => a.grade.localeCompare(b.grade))
      .map((item) => [item.domain, item])
  ).values()];

  res.json({ fame, shame });
});

app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));