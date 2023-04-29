const mongoose = require("mongoose");
const { Schema } = mongoose;
const { TaskSchema } = require("./Task");
const ProjectSchema = new Schema(
  {
    // Basic project information
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },

    // Project ownership
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Task relationships
    tasks: [TaskSchema],

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

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
