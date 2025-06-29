const User = require("../models/User");

exports.promoteUserToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) return res.status(404).json({ error: "User not found" });

    user.role = "admin";
    await user.save();

    res.json({ message: `${user.email} promoted to admin`, user });
  } catch (err) {
    console.error("Promotion error:", err);
    res.status(500).json({ error: "Server error" });
  }
};