const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");

exports.get_all_comments = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find().exec();

    return res.json(comments);
});

exports.get_comment_detail = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.id).exec();

    return res.json(comment);
});

exports.create_comment = asyncHandler(async (req, res, next) => {
    const comment = new Comment({
        author: req.body.authorId,
        createdAt: Date.now(),
        comment: req.body.comment,
        post_id: req.body.postId
    })

    await comment.save();

    res.json(comment);
});

exports.delete_comment = asyncHandler(async (req, res, next) => {
    await Comment.findByIdAndDelete(req.body.commentId).exec();
    
    return res.json("Comment deleted!");
});