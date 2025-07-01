const Media = require("../models/Media");
const cloudinary = require("../config/Cloudinary");

// Upload media (image/video) with caption
exports.uploadMedia = async (req, res) => {
  const { caption, mediaType, eventId } = req.body;

  if (!req.file || !mediaType || !eventId) {
    return res.status(400).json({ error: "File, mediaType, and eventId are required" });
  }

  try {
    const media = new Media({
      url: req.file.path,                // Uploaded Cloudinary URL from multer
      caption,
      mediaType,
      eventId,
      uploaderId: req.user._id,
    });

    const saved = await media.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ error: "Server error while uploading media" });
  }
};

// Delete media (admin or owner only)
exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: "Media not found" });

    // Authorization check
    if (
      media.uploaderId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not authorized to delete this media" });
    }

    // Extract publicId from Cloudinary URL
    const publicId = media.url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);

    await media.deleteOne();
    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error("Error deleting media:", err);
    res.status(500).json({ error: "Server error while deleting media" });
  }
};

// Like or unlike a media item
exports.toggleLike = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: "Media not found" });

    const userId = req.user._id.toString();
    const alreadyLiked = media.likes.includes(userId);

    if (alreadyLiked) {
      // Unlike
      media.likes = media.likes.filter(id => id.toString() !== userId);
    } else {
      // Like
      media.likes.push(userId);
    }

    await media.save();

    res.json({
      message: alreadyLiked ? "Unliked" : "Liked",
      likesCount: media.likes.length,
      likedByUser: !alreadyLiked
    });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ error: "Server error while toggling like" });
  }
};

// Get all media from a specific event
exports.getMediaByEvent = async (req, res) => {
  try {
    const media = await Media.find({ eventId: req.params.eventId })
      .populate("uploaderId", "name email profilePic")
      .sort({ createdAt: -1 });

    res.json(media);
  } catch (err) {
    console.error("Error fetching media by event:", err);
    res.status(500).json({ error: "Server error while fetching media" });
  }
};

// Get media uploaded by the logged-in user
exports.getMediaByUser = async (req, res) => {
  try {
    const media = await Media.find({ uploaderId: req.user._id })
      .sort({ createdAt: -1 });

    res.json(media);
  } catch (err) {
    console.error("Error fetching user media:", err);
    res.status(500).json({ error: "Server error while fetching your uploads" });
  }
};

exports.getMediaById = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate("uploaderId", "name email");
    if (!media) return res.status(404).json({ error: "Media not found" });
    res.json(media);
  } catch (err) {
    console.error("Error fetching media by ID:", err);
    res.status(500).json({ error: "Server error" });
  }
};