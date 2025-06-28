const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  passwordHash: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  profilePic: {
    type: String,
    default: "https://res.cloudinary.com/demo/image/upload/v1710000000/default-avatar.jpg"
    // Default avatar URL
  }
});

module.exports = mongoose.model("User", userSchema);
