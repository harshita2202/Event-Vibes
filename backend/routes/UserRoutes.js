const express = require("express");
const router = express.Router();

const { promoteUserToAdmin } = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/adminMiddleware");

router.put("/promote/:id", protect, isAdmin, promoteUserToAdmin);

module.exports = router;