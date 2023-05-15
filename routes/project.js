const express = require("express");
const Project = require("../models/Project");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Create a new project
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;

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
      description: description,
      user: userId,
      tags: [],
      requirements: [],
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

// Get all of the users projects
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const projects = await Project.find({ user: userId }).populate("tasks");

    res.status(200).json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
