const Media = require("../models/Media");

exports.uploadMedia = async (req, res) => {
  const { url, caption, mediaType, eventId } = req.body;

  if (!url || !mediaType || !eventId) {
    return res.status(400).json({ error: "All required fields must be provided" });
  }

  try {
    const media = new Media({
      url,
      caption,
      mediaType,
      eventId,
      uploaderId: req.user._id,
    });

    const saved = await media.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ error: "Server error while uploading" });
  }
};


exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

    if (
      media.uploaderId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not authorized to delete this media" });
    }

    await media.remove();
    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.toggleLike = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({ error: "Media not found" });
    }

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
    console.error("Like toggle error:", err);
    res.status(500).json({ error: "Server error" });
  }
};


exports.getMediaByEvent = async (req, res) => {
  try {
    const media = await Media.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    console.error("Error fetching event media:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getMediaByUser = async (req, res) => {
  try {
    const media = await Media.find({ uploaderId: req.user._id }).sort({ createdAt: -1 });
    res.json(media);
  } catch (err) {
    console.error("Error fetching user media:", err);
    res.status(500).json({ error: "Server error" });
  }
};