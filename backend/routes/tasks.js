const express = require("express");
const Task = require("../Schemas/TaskSchema");
const router = express.Router();
const Notification = require('../Schemas/NotificationSchema');

// Ensure authentication middleware (you already have this)
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.status(401).send("Not authenticated");
}

router.use(ensureAuth);

// ✅ Create a Task
// router.post("/", async (req, res) => {
//   try {
//     const { title, description, dueDate, priority, status, assignee } = req.body;

//     // Ensure priority and status are in valid format
//     const task = await Task.create({
//       title,
//       description,
//       dueDate,
//       priority: priority.toLowerCase(), // "Low" → "low"
//       status: status.toLowerCase().replace(" ", "-"), // "In Progress" → "in-progress"
//       assignee, 
//       createdBy: req.user._id,  // userId from session
//       userId: req.user._id, // ensure userId is properly set
//     });

//     res.status(201).json(task);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });
router.post("/", async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, assignee } = req.body;

    // Ensure priority and status are in valid format
    const task = await Task.create({
      title,
      description,
      dueDate,
      priority: priority.toLowerCase(), // "Low" → "low"
      status: status.toLowerCase().replace(" ", "-"), // "In Progress" → "in-progress"
      assignee, 
      createdBy: req.user._id,  // userId from session
      userId: req.user._id, // ensure userId is properly set
    });

    // Send notification to assignee
    if (assignee) {
      await Notification.create({
        user: assignee,   // User to whom the task is assigned
        task: task._id,   // Task ID
        message: `You’ve been assigned: ${task.title}`,
      });
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get All Tasks for the Logged-in User
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user._id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a Single Task by Task ID
router.get("/single/:taskId", async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).send("Task not found");
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Update a Task by Task ID
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
    res.status(400).json({ error: err.message });
  }
});

// ✅ Delete a Task by Task ID
router.delete("/:taskId", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.taskId);
    if (!deleted) return res.status(404).send("Task not found");
    res.send("Task deleted");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
