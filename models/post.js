const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  title: { type: String, require: true },
  content: { type: String, required: true },
  isPublished: { type: Boolean, required: true }
});

module.exports = mongoose.model("Post", PostSchema);