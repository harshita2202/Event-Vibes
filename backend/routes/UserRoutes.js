const express = require("express");
const router = express.Router();
const {
  promoteUserToAdmin,
  updateName,
  updatePassword,
  updateProfilePic,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload"); // for Cloudinary

// Existing admin route
router.put("/promote/:id", protect, isAdmin, promoteUserToAdmin);

// 👇 New routes
router.put("/update-name", protect, updateName);
router.put("/update-password", protect, updatePassword);
router.put("/update-profile-pic", protect, upload.single("file"), updateProfilePic);

module.exports = router;
