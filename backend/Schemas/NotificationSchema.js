const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // who the notification is for
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // who triggered the notification (optional but useful)
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true, // the related task
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);

