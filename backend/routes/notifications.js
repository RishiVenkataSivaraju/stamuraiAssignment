const express = require("express");
const Notification = require("../Schemas/NotificationSchema");
const router = express.Router();

// Middleware to ensure user is logged in
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).send("Not authenticated");
}

router.use(ensureAuth);

// Mark notifications as read
router.put("/:id/read", async (req, res) => {
  try {
    const notif = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { read: true },
      { new: true }
    );
    if (!notif) return res.status(404).send("Notification not found");
    res.json(notif);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get unread notifications for current user
router.get("/", async (req, res) => {
  try {
    const notifs = await Notification.find({ user: req.user._id, read: false })
      .populate("task", "title");
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
