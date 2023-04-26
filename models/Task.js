const mongoose = require("mongoose");
const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    // Basic task information
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },

    // Task ownership
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Task properties
    estimatedTime: {
      type: Number, // time in minutes
      default: 0,
    },
    status: {
      type: String,
      enum: ["Not Started", "Working On", "In Review", "Completed"],
      default: "Not Started",
    },
    recurrence: {
      type: String,
      enum: ["None", "Daily", "Weekly", "Monthly"],
      default: "None",
    },

    // Task relationships
    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],
    subtasks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subtask",
      },
    ],

    // Collaboration
    sharedWith: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", TaskSchema);
module.exports = Task;
