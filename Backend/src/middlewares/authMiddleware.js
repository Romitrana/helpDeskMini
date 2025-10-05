const jwt = require("jsonwebtoken");

const auth = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: { code: "UNAUTHORIZED", message: "No token provided" },
      });
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({
          error: { code: "FORBIDDEN", message: "Access denied" },
        });
      }

      next();
    } catch (err) {
      return res.status(401).json({
        error: {
          code: "INVALID_TOKEN",
          message: "Token is invalid or expired",
        },
      });
    }
  };
};

module.exports = auth;
