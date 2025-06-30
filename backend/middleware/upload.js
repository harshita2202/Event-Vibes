const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/Cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "event-media",
    allowed_formats: ["jpg", "jpeg", "png", "mp4"],
  },
});

const upload = multer({ storage });

module.exports = upload;
