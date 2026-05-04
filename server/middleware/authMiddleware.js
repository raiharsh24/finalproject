const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // ❌ No header
    if (!authHeader) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Expect format: Bearer TOKEN
    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    const token = parts[1];

    // 🔐 Verify token
    const decoded = jwt.verify(token, "SECRET_KEY");

    // Attach user to request
    req.user = decoded; // { id, role }

    next();
  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};