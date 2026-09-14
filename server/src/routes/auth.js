const express = require("express");
const rateLimit = require("express-rate-limit");
const { prisma } = require("../db");
const { hashPassword, comparePassword, signToken } = require("../lib/auth");
const { requireAuth } = require("../middleware/requireAuth");

const router = express.Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Slow down credential-stuffing / brute-force attempts on login.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many login attempts. Please try again in a few minutes." },
});

function publicUser(u) {
  return { id: u.id, name: u.name, email: u.email, createdAt: u.createdAt };
}

// POST /api/auth/register  { name, email, password }
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !String(name).trim()) return res.status(400).json({ error: "Name is required." });
  if (!email || !EMAIL_RE.test(String(email).trim())) return res.status(400).json({ error: "A valid email is required." });
  if (!password || String(password).length < 8) return res.status(400).json({ error: "Password must be at least 8 characters." });

  const cleanEmail = String(email).trim().toLowerCase();

  try {
    const existing = await prisma.user.findUnique({ where: { email: cleanEmail } });
    if (existing) return res.status(409).json({ error: "An account with that email already exists." });

    const passwordHash = await hashPassword(String(password));
    const user = await prisma.user.create({
      data: { name: String(name).trim(), email: cleanEmail, passwordHash },
    });

    const token = signToken(user);
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) {
    res.status(500).json({ error: "Could not create account." });
  }
});

// POST /api/auth/login  { email, password }
router.post("/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email and password are required." });

  const cleanEmail = String(email).trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({ where: { email: cleanEmail } });
    // Same generic message whether the email or the password was wrong —
    // never reveal which one, so attackers can't enumerate accounts.
    if (!user) return res.status(401).json({ error: "Invalid email or password." });

    const ok = await comparePassword(String(password), user.passwordHash);
    if (!ok) return res.status(401).json({ error: "Invalid email or password." });

    const token = signToken(user);
    res.json({ token, user: publicUser(user) });
  } catch (e) {
    res.status(500).json({ error: "Login failed." });
  }
});

// GET /api/auth/me — returns the authenticated user (validates the token is
// still good and the account still exists), used to restore sessions.
router.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) return res.status(401).json({ error: "Account no longer exists." });
  res.json({ user: publicUser(user) });
});

module.exports = router;
