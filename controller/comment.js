const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const comment = require("../models/comment");

exports.get_all_comments = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find().exec();

  return res.json(comments);
});

exports.get_comment_detail = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id).exec();

  if (comment === null) {
    const err = new Error();
    err.status = 404;
    err.message = "Comment not found!";
    return res.json(err);
  }

  return res.json(comment);
});

exports.create_comment = [
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

    const comment = new Comment({
      author: req.body.authorId,
      createdAt: Date.now(),
      comment: req.body.comment,
      post_id: req.body.postId,
    });

    await comment.save();

    return res.json({message: "Comment created", comment: comment});
  }),
];

exports.delete_comment = asyncHandler(async (req, res, next) => {
  if (req.body.commentId == null || req.body.commentId == "") {
    const err = new Error();
    err.status = 404;
    err.message = "Comment ID not provided!";
    return res.json(err);
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

  await Comment.findByIdAndDelete(req.body.userId);

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
      const err = new Error();
      err.status = 404;
      err.message = "Comment not found!";
      return res.json(err);
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
