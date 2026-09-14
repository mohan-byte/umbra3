const { verifyToken } = require("../lib/auth");

// Expects: Authorization: Bearer <token>
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ error: "Missing or malformed Authorization header. Expected: Bearer <token>." });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, email: payload.email, name: payload.name };
    next();
  } catch (e) {
    const message = e.name === "TokenExpiredError" ? "Session expired, please sign in again." : "Invalid token.";
    return res.status(401).json({ error: message });
  }
}

module.exports = { requireAuth };
