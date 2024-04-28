const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Post = require("../models/post");

exports.get_all_comments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find().exec();

  return res.json(comments);
});

exports.get_comment_detail = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id).exec();

  if (comment === null) {
    return res.status(404).json({message: "Comment not found!"});
  }

  return res.json(comment);
});

exports.create_comment = [
  body("authorId").trim().notEmpty(),
  body("postId").trim().notEmpty(),

  body("comment")
    .trim()
    .escape()
    .isLength({ min: 1, max: 200})
    .withMessage("Comment must be between 1 to 200 characters long."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => ({
        message: error.msg,
      }));
      return res.status(400).json({ errors: errorMessages });
    }

    const currentPost = await Post.findById(req.body.postId);

    if (currentPost === null){
      return res.status(404).json({errors: "The blog you are commenting under does not exist."})
    }

    const comment = new Comment({
      author: req.body.authorId,
      createdAt: Date.now(),
      comment: req.body.comment,
      post_id: req.body.postId,
    });

    await comment.save();

    currentPost.comments.push(comment._id);

    await currentPost.save();

    return res.json({message: "Comment created", comment: comment});
  }),
];

exports.delete_comment = asyncHandler(async (req, res, next) => {
  if (req.body.commentId == null || req.body.commentId == "") {
    return res.status(400).json({message: "Comment ID not provided!"});
  }

  if(req.body.postId === null) {
    return res.status(400).json({message: "A post ID is required."});
  }

  const comment = await Comment.findById(req.params.id).exec();

  if (
    comment.author.toString() !== req.user._id.toString() &&
    !req.user.admin
  ) {
    return res
      .status(403)
      .json({ message: "You are not authorized to delete this comment." });
  }

  const post = await Post.findById(req.body.postId).exec();

  post.comments = post.comments.filter((id) => id.toString() !== req.body.commentId.toString());

  post.save();
  
  await Comment.findByIdAndDelete(req.body.commentId);

  return res.status(200).json({ message: "Comment deleted successfully!" });
});

exports.update_comment = [
  body("authorId").notEmpty(),

  body("comment")
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage("Comment must have at least one character"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => ({
        message: error.msg,
      }));
      return res.status(400).json({ errors: errorMessages });
    }

    const comment = await Comment.findById(req.params.id).exec();

    if (comment === null) {
      return res.status(404).json({message: "Comment not found!"});
    }

    const updatedComment = new Comment({
      author: comment.author,
      createdAt: Date.now(),
      comment: req.body.comment,
      post_id: comment.post_id,
    });

    await updatedComment.save();

    return res.json({message: 'Your comment was updated!', comment: updatedComment});
  }),
];
