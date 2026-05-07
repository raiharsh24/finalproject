const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    /* ================= TOKEN EXTRACTION ================= */

    const authHeader =
      req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message:
          "No authorization token provided",
      });
    }

    /* ================= FORMAT CHECK ================= */

    const parts =
      authHeader.split(" ");

    if (
      parts.length !== 2 ||
      parts[0] !== "Bearer"
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid token format",
      });
    }

    const token = parts[1];

    /* ================= VERIFY TOKEN ================= */

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET ||
        "SECRET_KEY"
    );

    /* ================= ATTACH USER ================= */

    req.user = {
      id: decoded.id,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (err) {
    console.error(
      "AUTH ERROR:",
      err.message
    );

    return res.status(401).json({
      success: false,
      message:
        "Invalid or expired token",
    });
  }
};