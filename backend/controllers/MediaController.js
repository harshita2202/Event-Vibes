const Media = require("../models/Media");
const cloudinary = require("../config/Cloudinary");
const Event = require("../models/Event");
const User = require("../models/User");
const Notification = require("../models/Notification");

// Upload media
exports.uploadMedia = async (req, res) => {
  const { caption, mediaType, eventId } = req.body;

  if (!req.file || !mediaType || !eventId) {
    return res.status(400).json({ error: "File, mediaType, and eventId are required" });
  }

  try {
    const uploader = await User.findById(req.user._id);
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    const media = new Media({
      url: req.file.path,
      caption,
      mediaType,
      eventId,
      uploaderId: req.user._id,
    });

    const saved = await media.save();

    // ✅ Notify all other users
    const otherUsers = await User.find({ _id: { $ne: req.user._id } });
    for (const user of otherUsers) {
      console.log("Sending notification to:", user.name);
      await Notification.create({
        userId: user._id,
        message: `${uploader.name} uploaded a ${mediaType} in "${event.title}"`,
      });
    }

    res.status(201).json(saved);
  } catch (error) {
    console.error("Error uploading media:", error);
    res.status(500).json({ error: "Server error while uploading media" });
  }
};

// Toggle like
exports.toggleLike = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id).populate("uploaderId", "name _id");
    if (!media) return res.status(404).json({ error: "Media not found" });

    const userId = req.user._id.toString();
    const alreadyLiked = media.likes.includes(userId);

    if (alreadyLiked) {
      media.likes = media.likes.filter(id => id.toString() !== userId);
    } else {
      media.likes.push(userId);

      // ✅ Notify uploader
      if (media.uploaderId._id.toString() !== userId) {
        console.log("Sending like notification to:", media.uploaderId.name);
        await Notification.create({
          userId: media.uploaderId._id,
          message: `${req.user.name} liked your ${media.mediaType}`,
        });
      }
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

// Other unchanged methods (deleteMedia, getMediaByEvent, getMediaByUser, getMediaById)...

exports.deleteMedia = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);
    if (!media) return res.status(404).json({ error: "Media not found" });

    if (
      media.uploaderId.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ error: "Not authorized to delete this media" });
    }

    const publicId = media.url.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(`event-media/${publicId}`);
    await media.deleteOne();

    res.json({ message: "Media deleted successfully" });
  } catch (err) {
    console.error("Error deleting media:", err);
    res.status(500).json({ error: "Server error while deleting media" });
  }
};

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

exports.getMediaByUser = async (req, res) => {
  try {
    const media = await Media.find({ uploaderId: req.user._id }).sort({ createdAt: -1 });
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
