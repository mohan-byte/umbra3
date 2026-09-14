const express = require("express");
const { scanDomain, normDomain } = require("../lib/scan");
const { prisma } = require("../db");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

// Every route below requires a valid `Authorization: Bearer <token>` header —
// a watchlist is personal data, scoped to req.user.id throughout.
router.use(requireAuth);

async function persistScan(result, watchlistId) {
  return prisma.scanResult.create({
    data: {
      domain: result.domain,
      watchlistId,
      riskScore: result.summary.riskScore,
      riskBand: result.summary.riskBand,
      data: result,
    },
  });
}

async function latestScanFor(watchlistId) {
  const row = await prisma.scanResult.findFirst({
    where: { watchlistId },
    orderBy: { scannedAt: "desc" },
  });
  return row?.data ?? null;
}

// GET /api/watchlist — the current user's monitored domains + latest scan.
router.get("/", async (req, res) => {
  const domains = await prisma.watchlistDomain.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "asc" },
  });
  const rows = await Promise.all(
    domains.map(async (d) => ({
      domain: d.domain,
      createdAt: d.createdAt,
      scan: await latestScanFor(d.id),
    })),
  );
  res.set("Cache-Control", "no-store").json({ domains: rows });
});

// POST /api/watchlist  { domain }
router.post("/", async (req, res) => {
  const raw = (req.body?.domain || "").trim();
  if (!raw) return res.status(400).json({ error: "domain is required" });
  const domain = normDomain(raw);

  try {
    const record = await prisma.watchlistDomain.upsert({
      where: { userId_domain: { userId: req.user.id, domain } },
      update: {},
      create: { domain, userId: req.user.id },
    });

    let scan = null;
    let error;
    try {
      scan = await scanDomain(domain);
      await persistScan(scan, record.id);
    } catch (e) {
      error = e instanceof Error ? e.message : "scan failed";
    }

    res.status(201).json({ domain, createdAt: record.createdAt, scan, error });
  } catch (e) {
    res.status(500).json({ error: e instanceof Error ? e.message : "failed to add domain" });
  }
});

// POST /api/watchlist/:domain/rescan
router.post("/:domain/rescan", async (req, res) => {
  const domain = normDomain(req.params.domain);
  const record = await prisma.watchlistDomain.findUnique({
    where: { userId_domain: { userId: req.user.id, domain } },
  });
  if (!record) return res.status(404).json({ error: "domain is not on your watchlist" });

  try {
    const scan = await scanDomain(domain);
    await persistScan(scan, record.id);
    res.set("Cache-Control", "no-store").json({ domain, scan });
  } catch (e) {
    res.status(502).json({ error: e instanceof Error ? e.message : "scan failed" });
  }
});

// DELETE /api/watchlist/:domain
router.delete("/:domain", async (req, res) => {
  const domain = normDomain(req.params.domain);
  try {
    await prisma.watchlistDomain.delete({
      where: { userId_domain: { userId: req.user.id, domain } },
    });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: "domain is not on your watchlist" });
  }
});

module.exports = router;
