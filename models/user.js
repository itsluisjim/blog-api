const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  first: { type: String, required: true },
  last: { type: String, required: true },
  email: { type: String, required: true },
  hash: { type: String, required: true },
  salt: { type: String, required: true },
  admin: { type: Boolean },
});

module.exports = mongoose.model("User", UserSchema);
