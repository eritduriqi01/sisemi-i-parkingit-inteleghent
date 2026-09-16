const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
}

async function register(req, res) {
  const { name, email, password, plate } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email-i eshte i regjistruar" });

    const user = await User.create({ name, email, password, plate });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      plate: user.plate,
      token: signToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Email ose fjalekalim gabim" });
    }
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      plate: user.plate,
      token: signToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function me(req, res) {
  res.json(req.user);
}

module.exports = { register, login, me };
