require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/auth");
const cveRoutes = require("./routes/cve");
const scanRoutes = require("./routes/scan");
const darkwebRoutes = require("./routes/darkweb");
const watchlistRoutes = require("./routes/watchlist");
const settingsRoutes = require("./routes/settings");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet({ contentSecurityPolicy: false })); // CSP off: we serve a Vite SPA, not worth hand-tuning here
app.use(express.json());

// Only needed in dev when the Vite dev server (a different port) calls this
// API directly. In production the client is served from this same origin.
if (process.env.CORS_ORIGIN) {
  app.use(cors({ origin: process.env.CORS_ORIGIN.split(",").map((s) => s.trim()) }));
}

app.use("/api/auth", authRoutes);
app.use("/api/cve", cveRoutes);
app.use("/api/scan", scanRoutes);
app.use("/api/darkweb", darkwebRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/settings", settingsRoutes);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// ── Serve the built React (Vite) client ────────────────────────────────────
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
app.use(express.static(clientDist));

// SPA fallback: any non-API GET request returns index.html so client-side
// routing (react-router) can take over.
app.get(/^\/(?!api\/).*/, (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Umbra API + client listening on http://localhost:${PORT}`);
});
