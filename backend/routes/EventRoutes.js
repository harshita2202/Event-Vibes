const express = require("express");
const router = express.Router();

const { createEvent } = require("../controllers/EventController");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

router.post("/create", protect, isAdmin, createEvent);

module.exports = router;