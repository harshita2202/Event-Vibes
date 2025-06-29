const Event = require("../models/Event");

exports.createEvent = async (req, res) => {
  const { title, description, coverImage } = req.body;

  // Validation
  if (!title || !coverImage) {
    return res.status(400).json({ error: "Title and cover image are required" });
  }

  try {
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
