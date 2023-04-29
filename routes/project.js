const express = require("express");
const Project = require("../models/Project");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Create a new project
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title } = req.body;

    // Use the user ID from the authMiddleware
    const userId = req.userId;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new project
    const newProject = new Project({
      title: title,
      user: userId,
      tasks: [],
    });

    // Save the project to the database
    const savedProject = await newProject.save();

    // Return a response to the client
    res
      .status(201)
      .json({ message: "Project created successfully", project: savedProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const projects = await Project.find({ user: userId }).populate("tasks");

    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
