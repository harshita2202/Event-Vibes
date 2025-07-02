const User = require("../models/User");
const bcrypt = require("bcryptjs");
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
}
// 1. Update Name
exports.updateName = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ error: "Name cannot be empty" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.name = name.trim();
    await user.save();

    res.json({ message: "Name updated", name: user.name });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// 2. Update Password
exports.updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both passwords required" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: "Incorrect current password" });

    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// 3. Update Profile Picture
exports.updateProfilePic = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.profilePic = req.file.path;
    await user.save();

    res.json({ message: "Profile picture updated", profilePic: user.profilePic });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};