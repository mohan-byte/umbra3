const express = require("express");

const router = express.Router();

// GET /api/settings/sources — tells the client which optional integration
// keys are configured server-side, without ever exposing the values
// themselves (mirrors the original Next.js server component's
// `process.env.X ? "keyed" : ...` checks, done safely on the backend).
router.get("/sources", (_req, res) => {
  res.json({
    NVD_API_KEY: Boolean(process.env.NVD_API_KEY),
    GITHUB_TOKEN: Boolean(process.env.GITHUB_TOKEN),
    THREATFOX_API_KEY: Boolean(process.env.THREATFOX_API_KEY),
    DEHASHED_API_KEY: Boolean(process.env.DEHASHED_API_KEY),
    INTELX_API_KEY: Boolean(process.env.INTELX_API_KEY),
  });
});

module.exports = router;
