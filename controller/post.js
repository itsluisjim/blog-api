const asyncHandler = require("express-async-handler");
const Post = require("../models/post");
const { body, validationResult } = require("express-validator");

require("../config/connection");

exports.get_all_posts = asyncHandler(async (req, res, next) => {
  const list_of_posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author")
    .exec();

  return res.json(list_of_posts);
});
exports.create_post = [
  body("authorId").notEmpty(),

  body("title")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Content must not be empty!")
    .isLength({ min: 5, max: 40 })
    .withMessage("Title must be between 5-50 characters long."),

  body("content")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Content must not be empty!"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => ({
        message: error.msg,
      }));
      return res.status(400).json({ errors: errorMessages });
    }

    const post = new Post({
      author: req.body.authorId,
      createdAt: Date.now(),
      title: req.body.title,
      content: req.body.content,
    });

    await post.save();

    return res.json(post);
  }),
];

exports.delete_post = asyncHandler(async (req, res, next) => {
  if (req.body.postId == null || req.body.postId == "") {
    const err = new Error();
    err.status = 404;
    err.message = "Post ID not provided!";
    return res.json(err);
  }

  const post = await Post.findById(req.params.id).exec();

  if (post === null) {
    const err = new Error();
    err.status = 404;
    err.message = "Post not found!";
    return res.json(err);
  } else {
    await Post.findByIdAndDelete(req.body.postId);
    return res.json({ message: "Post was deleted successfully!" });
  }
});
exports.get_post_details = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).populate("author").exec();

  if (post === null) {
    const err = new Error();
    err.status = 404;
    err.message = "Post not found!";
    return res.json(err);
  }
  return res.json(post);
});
exports.update_post = [
  body("title")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Content must not be empty!")
    .isLength({ min: 5, max: 40 })
    .withMessage("Title must be between 5-50 characters long."),

  body("content")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Content must not be empty!"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => ({
        message: error.msg,
      }));
      return res.status(400).json({ errors: errorMessages });
    }

    const post = await Post.findById(req.params.id).exec();

    if (post == null) {
      return res.status(404).json("Post not found!");
    }

    const updatedPost = new Post({
      _id: req.params.id,
      author: post.author._id,
      title: req.body.title,
      content: req.body.content,
      createdAt: Date.now(),
    });

    await Post.findByIdAndUpdate(req.params.id, updatedPost, {});

    return res.json(updatedPost);
  }),
];
