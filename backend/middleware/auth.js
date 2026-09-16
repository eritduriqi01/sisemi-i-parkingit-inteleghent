const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Nuk je i autorizuar" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "Perdoruesi nuk ekziston" });
    next();
  } catch (err) {
    res.status(401).json({ message: "Token i pavlefshem" });
  }
}

function admin(req, res, next) {
  if (req.user && req.user.role === "admin") return next();
  res.status(403).json({ message: "Vetem admini ka qasje" });
}

module.exports = { protect, admin };
