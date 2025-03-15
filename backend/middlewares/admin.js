const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { Admin } = require("../db/index");

async function adminMiddleWare(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(400).json({
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;

    const admin = await Admin.findById(req.userId);

    if (!admin) {
      return res.status(403).json({
        message: "You are not authorized to access this resource. Admins only.",
      });
    }

    next();
  } catch (err) {
    res.status(403).json({
      message: "Failed to authenticate token",
    });
  }
}

module.exports = adminMiddleWare;
