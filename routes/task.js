const express = require("express");
const router = express.Router();
const { Task } = require("../models/Task");
const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      title,
      description,
      dueDate,
      estimatedTime,
      status,
      recurrence,
      tags,
      subtasks,
      sharedWith,
      projectId,
    } = req.body;

    // Validate required fields
    if (!title || !projectId) {
      return res
        .status(400)
        .json({ message: "Title and project ID are required" });
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      dueDate,
      user: req.userId,
      estimatedTime,
      status,
      recurrence,
      tags,
      subtasks,
      sharedWith,
      project: projectId,
    });

    // Save the task to the database
    const savedTask = await newTask.save();

    // Add the saved task to the project
    await Project.findOneAndUpdate(
      { _id: projectId },
      { $push: { tasks: savedTask } }
    );

    res.status(201).json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
