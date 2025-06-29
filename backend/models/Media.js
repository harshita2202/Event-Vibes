const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema(
  {
    mediaType: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },

    caption: {
      type: String,
    },

    url: {
      type: String,
      required: true,
    },

    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },

    uploaderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Media", mediaSchema);