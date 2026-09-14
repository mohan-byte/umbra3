const express = require("express");
const { scanDomain, normDomain } = require("../lib/scan");
const { prisma } = require("../db");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

const DOMAIN_RE = /^[a-z0-9.-]+\.[a-z]{2,}$/i;

// GET /api/scan?domain=example.com   (requires Authorization: Bearer <token>)
// Live, keyless domain exposure scan across free public intel sources.
// Every scan is persisted to Postgres (ScanResult) — linked to the caller's
// WatchlistDomain row if they're already watching that domain — so scan
// history is never lost even though the intelligence itself is fetched live
// each time.
router.get("/", requireAuth, async (req, res) => {
  const domainParam = (req.query.domain || "").trim();
  if (!domainParam) {
    return res.status(400).json({ error: "Provide ?domain=" });
  }
  const cleaned = domainParam.replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");
  if (!DOMAIN_RE.test(cleaned)) {
    return res.status(400).json({ error: "That doesn't look like a valid domain." });
  }

  try {
    const result = await scanDomain(domainParam);

    // Best-effort persistence — a DB hiccup should never break a live scan.
    try {
      const watchlist = await prisma.watchlistDomain.findUnique({
        where: { userId_domain: { userId: req.user.id, domain: result.domain } },
      });
      await prisma.scanResult.create({
        data: {
          domain: result.domain,
          watchlistId: watchlist?.id,
          riskScore: result.summary.riskScore,
          riskBand: result.summary.riskBand,
          data: result,
        },
      });
    } catch (dbErr) {
      console.error("scan persistence failed:", dbErr.message);
    }

    res.set("Cache-Control", "no-store").json(result);
  } catch (e) {
    res.status(502).json({ error: e instanceof Error ? e.message : "Scan failed" });
  }
});

module.exports = router;
module.exports.normDomain = normDomain;
