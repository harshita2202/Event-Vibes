//This file contains the actual logic behind register and login functionality.

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const adminEmails = process.env.ADMIN_EMAILS.split(",");


exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Check college email domain
  if (!email.endsWith("@jklu.edu.in")) {
    return res.status(400).json({ error: "Only college emails allowed" });
  }

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "Email already exists" });

  // Load admin emails safely here
  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(e => e.trim());

  const role = adminEmails.includes(email) ? "admin" : "user";

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    passwordHash: hash,
    role,
  });

  await newUser.save();

  const token = generateToken(newUser._id);

  res.status(201).json({
    token,
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    }
  });
};
// @route POST /api/auth/login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) return res.status(400).json({ error: "Invalid password" });

  const token = generateToken(user._id);

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};
