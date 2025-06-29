const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    coverImage: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Event", eventSchema);