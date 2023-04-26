const mongoose = require("mongoose");
const { Schema } = mongoose;

const TagSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Tag = mongoose.model("Tag", TagSchema);
module.exports = Tag;
