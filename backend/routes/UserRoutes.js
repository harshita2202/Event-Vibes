const express = require("express");
const router = express.Router();
const {
  promoteUserToAdmin,
  demoteUserToNormal,
  updateName,
  updatePassword,
  updateProfilePic,
  searchUsers   
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware"); // ✅ use only this
const isAdmin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload"); 

router.put("/promote/:id", protect, isAdmin, promoteUserToAdmin);
router.put("/demote/:id", protect, isAdmin, demoteUserToNormal);
router.put("/update-name", protect, updateName);
router.put("/update-password", protect, updatePassword);
router.put("/update-profile-pic", protect, upload.single("file"), updateProfilePic);
router.get("/search", protect, isAdmin, searchUsers);

// ✅ Fixed delete-profile-pic route
router.put("/delete-profile-pic", protect, async (req, res) => {
  try {
    const user = req.user;
    user.profilePic = ''; // Clear profile picture
    await user.save();

    res.status(200).json({ message: "Profile picture removed" });
  } catch (err) {
    res.status(500).json({ error: "Could not delete profile picture" });
  }
});

module.exports = router;
