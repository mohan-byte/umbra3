const express = require("express");
const { getGlobalDarkWeb, searchDarkWeb } = require("../lib/darkweb");

const router = express.Router();

// GET /api/darkweb/global — global ransomware leak-site feed + stats, used by
// the Overview and Dark Web Radar pages (were Next.js server components).
router.get("/global", async (_req, res) => {
  const data = await getGlobalDarkWeb();
  res.set("Cache-Control", "no-store").json(data);
});

// GET /api/darkweb/search?q=keyword — search ransomware leak-site victims.
router.get("/search", async (req, res) => {
  const q = (req.query.q || "").trim();
  if (!q) return res.json({ victims: [] });
  const victims = await searchDarkWeb(q);
  res.set("Cache-Control", "no-store").json({ victims });
});

module.exports = router;
