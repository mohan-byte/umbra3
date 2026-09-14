const express = require("express");
const { getRecentCVEs, searchCVEs } = require("../lib/cve");

const router = express.Router();

// GET /api/cve/recent — recently published CVEs (last 8 days), used by the
// Vulnerabilities page on load (was a Next.js server component before).
router.get("/recent", async (_req, res) => {
  const items = await getRecentCVEs();
  res.set("Cache-Control", "no-store").json({ items });
});

// GET /api/cve?q=apache  (or a CVE id, e.g. CVE-2024-3094)
router.get("/", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ items: [] });
  const items = await searchCVEs(q);
  res.set("Cache-Control", "no-store").json({ items });
});

module.exports = router;
