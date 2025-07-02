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

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");
const upload = require("../middleware/upload"); 

router.put("/promote/:id", protect, isAdmin, promoteUserToAdmin);
router.put("/demote/:id", protect, isAdmin, demoteUserToNormal);
router.put("/update-name", protect, updateName);
router.put("/update-password", protect, updatePassword);
router.put("/update-profile-pic", protect, upload.single("file"), updateProfilePic);
router.get("/search", protect, isAdmin, searchUsers);


module.exports = router;
