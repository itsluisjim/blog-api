const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

require("../config/connection");

exports.list_all_authors = asyncHandler(async (req, res, next) => {
  const list_of_authors = await User.find().sort({ last: 1 }).select("_id username first last").exec();
  return res.json(list_of_authors);
});
exports.update_user = [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage("Username must be longer than 8 characters")
    .isAlphanumeric()
    .withMessage("Username has non-alphanumeric characters."),

  body("first")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("First name must be longer than 2 characters.")
    .isAlpha()
    .withMessage("First name must contain only alphabetical characters."),

  body("last")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Last name must be longer than 2 characters.")
    .isAlpha()
    .withMessage("Last name must contain only alphabetical characters."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => ({
        message: error.msg,
      }));
      return res.status(400).json({ errors: errorMessages });
    }

    const user = await User.findById(req.params.id).exec();

    if (user == null) {
      return res.status(404).json({message: "User not found!"});
    }

    const updatedUser = new User({
      _id: req.params.id,
      username: req.body.username,
      first: req.body.first,
      last: req.body.last,
      email: user.email,
      hash: user.hash,
      salt: user.salt,
      admin: user.admin,
    });

    if (user._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this user." });
    }

    await User.findByIdAndUpdate(req.params.id, updatedUser, {});

    return res.json({ message: "User Updated!", user: updatedUser });
  }),
];
exports.delete_user = asyncHandler(async (req, res, next) => {
  if (req.body.authorId == null || req.body.authorId == "") {
    return res.status(400).json({message: "User ID not provided!"});
  }

  const user = await User.findById(req.params.authorId).exec();

  if (user === null) {
    return res.status(404).json({message: "User not found!"});
  }

  if (!req.user.admin) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this user." });
  }

  await Promise.all([
    Post.deleteMany({author: req.body.authorId}),
    Comment.deleteMany({author: req.body.authorId}),
    User.findByIdAndDelete(req.body.authorId)
  ]);

  return res.json({ message: "User was deleted successfully!" });
});
exports.get_user_detail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("username first last email admin").exec();

  if (user === null) {
    return res.status(404).json({message: "User not found!"});
  }

  return res.json(user);
});