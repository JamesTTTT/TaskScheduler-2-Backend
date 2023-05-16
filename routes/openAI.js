const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const User = require("../models/User");
const { OpenAIApi, Configuration } = require("openai");

const openAiKey = process.env.OPENAI_KEY;

const configuration = new Configuration({
  apiKey: openAiKey,
});
const openai = new OpenAIApi(configuration);

router.post("/recommend", authMiddleware, async (req, res) => {
  const { tasks, project } = req.body;

  try {
    const userId = req.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let prompt = `The project: ${project.title} is about ${project.description}. The current tasks are:\n`;

    tasks.forEach((task, i) => {
      prompt += `${i + 1}. ${task}\n`;
    });

    prompt += `Based on these, suggest three distinct additional tasks with a title and a description for each task. Please format your response as a JSON object with a "tasks" array. Each object in the "tasks" array should have a "title" and a "description". Like this: {"tasks": [{"title": "Task Title", "description": "Task description"}]}`;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 200,
      temperature: 0.6,
    });

    const suggestedTasks = response.data.choices[0].message;
    console.log(suggestedTasks);
    if (suggestedTasks) {
      let tasks;
      try {
        // Remove any leading/trailing whitespace
        const trimmedTasksString = suggestedTasks.content.trim();
        // Check if the first and last characters are curly braces (indicating a JSON object)
        if (
          trimmedTasksString[0] === "{" &&
          trimmedTasksString[trimmedTasksString.length - 1] === "}"
        ) {
          tasks = JSON.parse(trimmedTasksString);
        } else {
          throw new Error("AI output is not a properly formatted JSON object");
        }
      } catch (err) {
        console.error("Failed to parse tasks:", err);
        return res.status(500).json({
          success: false,
          error: { message: "Failed to parse tasks: " + err.message },
        });
      }
      return res.status(200).json({ success: true, data: tasks });
    } else {
      return res
        .status(400)
        .json({ success: false, error: { message: "No response" } });
    }
  } catch (err) {
    console.error(err);
    // console.error(err.response.data);
    return res
      .status(500)
      .json({ success: false, error: { message: "Server error" } });
  }
});

module.exports = router;
