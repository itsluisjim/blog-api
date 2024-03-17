const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  comment: { type: String, require: true },
  post_id: { type: Schema.Types.ObjectId, ref: "Post"}
});

module.exports = mongoose.model("Comment", CommentSchema);
