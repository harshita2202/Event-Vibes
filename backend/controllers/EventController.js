const Event = require("../models/Event");
const Media = require("../models/Media");
const cloudinary = require("../config/Cloudinary");

// ✅ Updated Create Event controller
exports.createEvent = async (req, res) => {
  const { title, description, coverImageUrl } = req.body;

  const existing = await Event.findOne({ title });
  if (existing) {
    return res.status(409).json({ error: "An event with this title already exists." });
  }

  // Check: either URL or uploaded file must be provided
  if (!title || (!req.file && !coverImageUrl)) {
    return res.status(400).json({ error: "Title and cover image (file or URL) is required" });
  }

  try {
    const coverImage = req.file ? req.file.path : coverImageUrl;

    const newEvent = new Event({
      title,
      description,
      coverImage,
      createdBy: req.user._id,
    });

    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Server error while creating event" });
  }
};

// ✅ Fetch all events
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Server error while fetching events" });
  }
};

// ✅ Delete event and all associated media
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Delete media from Cloudinary
    const mediaList = await Media.find({ eventId: req.params.id });
    for (let media of mediaList) {
      const publicId = media.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
      await media.deleteOne(); // instead of remove()
    }

    await Event.deleteOne({ _id: req.params.id }); // replace event.remove()

    res.json({ message: "Event and associated media deleted." });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ error: "Server error while deleting event" });
  }
};


// ✅ Update an existing event
exports.updateEvent = async (req, res) => {
  const { title, description, coverImageUrl } = req.body;
  const eventId = req.params.id;

  try {
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // ❗ Prevent duplicate title (only if changed)
    if (title && title !== event.title) {
      const existing = await Event.findOne({ title });
      if (existing) {
        return res.status(409).json({ error: "Another event with this title already exists." });
      }
    }

    event.title = title || event.title;
    event.description = description || event.description;

    // Update cover image if new one provided
    if (req.file) {
      event.coverImage = req.file.path;
    } else if (coverImageUrl) {
      event.coverImage = coverImageUrl;
    }

    await event.save();
    res.status(200).json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ error: "Server error while updating event" });
  }
};
