const asyncHandler = require("express-async-handler");
const Post = require("../models/post");

require("../config/connection");

exports.get_all_posts = asyncHandler(async (req, res, next) => {
  const list_of_posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("author")
    .exec();

  return res.json(list_of_posts);
});
exports.create_post = asyncHandler(async (req, res, next) => {
  const post = new Post({
    author: req.body.authorId,
    createdAt: Date.now(),
    title: req.body.title,
    content: req.body.content,
  });

  await post.save();

  return res.json(post);
});
exports.delete_post = asyncHandler(async (req, res, next) => {
  const post = await Post.findById(req.params.id).exec();

  if (post === null) {
    return res.json("Post not found!");
  } else {
    await Post.findByIdAndDelete(req.body.userId);
    res.json("Post was deleted successfully!");
  }
});
exports.get_post_details = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('author').exec();

    if(post == null){
        return res.json("Post not found!");
    }
    return res.json(post);
});
exports.update_post = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id).exec();

    if(post == null){
        return res.json("Post not found!");
    }

    const updatedPost = new Post({
        _id: req.params.id,
        author: post.author._id,
        title: req.body.title,
        content: req.body.content,
        createdAt: Date.now()
    });

    await Post.findByIdAndUpdate(req.params.id, updatedPost, {});

    res.json(updatedPost);
});
