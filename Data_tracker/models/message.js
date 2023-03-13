const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  body: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    enum: {
      values: ["Direct", "Retired", "Failed"],
      message: "{VALUE} is not supported.",
    },
    required: true,
    trim: true,
  },
  requestId: {
    type: Number,
  },
  createdTime: {
    type: Date,
    default: new Date(),
  },
  userId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("message", messageSchema);
