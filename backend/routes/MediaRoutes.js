const express = require("express");
const router = express.Router();
const {
  uploadMedia,
  deleteMedia,
  toggleLike,
  getMediaByEvent,
  getMediaByUser,
  getMediaById
} = require("../controllers/MediaController");

const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

// POST /api/media/upload with real file upload
router.post("/upload", protect, upload.single("file"), uploadMedia);

router.delete("/:id", protect, deleteMedia);
router.post("/:id/like", protect, toggleLike);
router.get("/event/:eventId", protect, getMediaByEvent);
router.get("/user/me", protect, getMediaByUser);
router.get("/:id", protect, getMediaById);

module.exports = router;
