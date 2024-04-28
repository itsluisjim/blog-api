const asyncHandler = require("express-async-handler");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { body, validationResult } = require("express-validator");

require("../config/connection");

exports.get_all_posts = asyncHandler(async (req, res, next) => {
  const list_of_posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate({
      path: 'author',
      select: '-hash -salt -admin -email -__v'
    })
    .exec();

  return res.json(list_of_posts);
});
exports.get_all_posts_by_author = asyncHandler(async (req, res, next) => {

  const list_of_posts_by_author = await Post.find({ author: req.params.id})
    .sort({ createdAt: -1 })
    .exec();

  return res.json(list_of_posts_by_author);
});
exports.get_post_details = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id)
    .populate(
      {
        path: 'author',
        select: '-hash -salt -admin -email -__v'
      })
    .populate({
      path: 'comments', 
      options: { sort: { createdAt: -1 } },
      populate: {
        path: 'author',
        select: '-hash -salt -admin -email -__v'
      }  
    })
    .exec();

  if (post === null) {
    return res.status(404).json({message: 'Post not found!'});
  }
  return res.json(post);
});
exports.create_post = [
  body("authorId").notEmpty(),

  body("title")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Content must not be empty!")
    .isLength({ min: 5, max: 80 })
    .withMessage("Title must be between 5-80 characters long."),

  body("content")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Content must not be empty!"),

  body("published")
    .isBoolean()
    .notEmpty()
    .withMessage("Choose whether your blog is published or unpublished"),

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
      isPublished: req.body.published,
      comments: []
    });

    await post.save();

    return res.json({message: "Post Created!", post: post});
  }),
];
exports.delete_post = asyncHandler(async (req, res, next) => {
  if (req.body.postId == null || req.body.postId == "") {
    return res.status(400).json({message: "Post ID not provided!"});
  }

  const post = await Post.findById(req.params.id).exec();

  if (post === null) {
    return res.status(404).json({message: "Post not found!"});
  } 

  if (post.author.toString() !== req.user._id.toString() && !req.user.admin) {
    return res.status(403).json({ message: "You are not authorized to delete this post." });
  }

  Promise.all([
    await Comment.deleteMany({post_id: req.body.postId}),
    await Post.findByIdAndDelete(req.body.postId)
  ]);

  return res.json({ message: "Post was deleted successfully!" });
  
});
exports.update_post = [
  body("title")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Content must not be empty!")
    .isLength({ min: 5, max: 80 })
    .withMessage("Title must be between 5-80 characters long."),

  body("content")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Content must not be empty!"),

  body("published")
    .isBoolean()
    .notEmpty()
    .withMessage("Choose whether your blog is published or unpublished"),

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

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to update this post." });
    }

    const updatedPost = new Post({
      _id: req.params.id,
      author: post.author._id,
      title: req.body.title,
      content: req.body.content,
      createdAt: Date.now(),
      isPublished: req.body.published,
      comments: post.comments
    });

    await Post.findByIdAndUpdate(req.params.id, updatedPost, {});

    return res.json({ message: "Updated Post!", post: updatedPost });
  }),
];
