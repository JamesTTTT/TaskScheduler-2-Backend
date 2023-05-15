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

    requirements: {
      type: [String],
    },

    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    // Task relationships
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],

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
