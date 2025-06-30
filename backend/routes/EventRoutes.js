const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,      
  deleteEvent,
  updateEvent  
} = require("../controllers/EventController");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

const upload = require("../middleware/upload");
router.post("/create", protect, isAdmin, upload.single("coverImageFile"), createEvent);
router.get("/", getEvents);
router.delete("/:id", protect, isAdmin, deleteEvent);
router.put("/:id", protect, isAdmin, upload.single("coverImageFile"), updateEvent);

module.exports = router;