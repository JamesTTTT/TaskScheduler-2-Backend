const mongoose = require("mongoose");
const { Schema } = mongoose;

const SubtaskSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
  },
  {
    timestamps: true, // Add this line
  }
);

const Subtask = mongoose.model("Subtask", SubtaskSchema);
module.exports = Subtask;
