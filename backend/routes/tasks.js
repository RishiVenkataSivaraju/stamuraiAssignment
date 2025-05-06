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

    if (assignee && assignee.toString() !== req.user._id.toString()) {
      await Notification.create({
        recipient: assignee,
        sender: req.user._id,
        taskId: task._id,
        message: `You've been assigned a new task: "${task.title}"`,
      });
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: "Task creation failed: " + err.message });
  }
});

// Get all tasks created by or assigned to the logged-in user, with search and filters
router.get("/", async (req, res) => {
  try {
    const { search, status, priority, dueBefore, dueAfter } = req.query;

    const query = {
      $or: [
        { createdBy: req.user._id },
        { assignee: req.user._id }
      ]
    };

    // Search by title or description
    if (search) {
      const searchRegex = { $regex: search, $options: "i" };
      query.$and = [
        {
          $or: [
            { title: searchRegex },
            { description: searchRegex }
          ]
        }
      ];
    }

    // Filter by status
    if (status) {
      query.status = status.toLowerCase().replace(" ", "-");
    }

    // Filter by priority
    if (priority) {
      query.priority = priority.toLowerCase();
    }

    // Filter by due date range
    if (dueBefore || dueAfter) {
      query.dueDate = {};
      if (dueBefore) query.dueDate.$lte = new Date(dueBefore);
      if (dueAfter) query.dueDate.$gte = new Date(dueAfter);
    }

    const tasks = await Task.find(query);
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



