const express = require("express");
const router = express.Router();
const {
  uploadMedia,
  deleteMedia,
  toggleLike,
  getMediaByEvent,
  getMediaByUser
} = require("../controllers/MediaController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); 

router.post("/upload", protect, upload.single("file"), uploadMedia); 
router.delete("/:id", protect, deleteMedia);
router.post("/:id/like", protect, toggleLike);
router.get("/event/:eventId", protect, getMediaByEvent);
router.get("/user/me", protect, getMediaByUser);

module.exports = router;