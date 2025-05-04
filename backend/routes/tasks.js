const express = require("express");
const Task = require("../Schemas/TaskSchema");
const Notification = require("../Schemas/NotificationSchema");
const router = express.Router();

// Authentication guard
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).send("Not authenticated");
}
router.use(ensureAuth);

// Create a Task (with notification)
router.post("/", async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignee } = req.body;

    // Create the task
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority: priority.toLowerCase(),
      status: status.toLowerCase().replace(" ", "-"),
      assignee,
      createdBy: req.user._id,
      userId: req.user._id,
    });

    // Notify the assignee (if different from creator)
    if (assignee && assignee.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: assignee,             // who the notification is for
        sender:    req.user._id,         // who triggered it
        taskId:    task._id,             // which task
        message:   `You've been assigned a new task: "${task.title}"`,
      });
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: "Task creation failed: " + err.message });
  }
});

// Get all tasks created by the logged-in user
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { createdBy: req.user._id },   // Tasks created by the user
        { assignee: req.user._id }      // Tasks assigned to the user
      ]
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Get one task by ID
router.get("/single/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).send("Task not found");
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Error fetching task" });
  }
});

// Update a task by ID
router.put("/:taskId", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true }
    );
    if (!updatedTask) return res.status(404).send("Task not found");
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ error: "Error updating task" });
  }
});

// Delete a task by ID
router.delete("/:taskId", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.taskId);
    if (!deleted) return res.status(404).send("Task not found");
    res.send("Task deleted");
  } catch (err) {
    res.status(500).json({ error: "Error deleting task" });
  }
});

module.exports = router;


