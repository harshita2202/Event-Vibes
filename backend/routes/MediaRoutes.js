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

router.post("/upload", protect, uploadMedia);
router.delete("/:id", protect, deleteMedia);
router.post("/:id/like", protect, toggleLike);
router.get("/event/:eventId", protect, getMediaByEvent);
router.get("/user/me", protect, getMediaByUser);

module.exports = router;