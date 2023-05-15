const express = require("express");
const Tags = require("../models/Tags");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

// Create a new tag
router.post("/create", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    // Use the user ID from the authMiddleware
    const userId = req.userId;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new tag
    const newTag = new Tags({
      name: name,
      user: userId,
    });

    // Save the tag to the database
    const savedTag = await newTag.save();

    // Return a response to the client
    res
      .status(201)
      .json({ message: "Tag created successfully", tag: savedTag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all of the users tags
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const tags = await Tags.find({ user: userId });

    res.status(200).json(tags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a tag
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const tagId = req.params.id;
    const userId = req.userId;

    // Find the tag
    const tag = await Tags.findById(tagId);

    // Check if the tag exists and if it belongs to the current user
    if (!tag || tag.user.toString() !== userId) {
      return res.status(404).json({ message: "Tag not found" });
    }

    // Delete the tag
    await Tags.findByIdAndRemove(tagId);

    // Return a response to the client
    res.status(200).json({ message: "Tag deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
