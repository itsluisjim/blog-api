const asyncHandler = require("express-async-handler");
const User = require('../models/user');

require('../config/connection');

exports.list_all_authors = asyncHandler(async (req, res, next) => {
    const list_of_authors = await User.find().sort({last: 1}).exec();

    return res.json(list_of_authors);
})

exports.create_user = asyncHandler(async (req, res, next) => {
    const user = new User({
        username: req.body.username,
        first: req.body.first,
        last: req.body.last,
        email: req.body.email,
        hash: req.body.hash,
        salt: req.body.salt,
        admin: req.body.admin
    });
    await user.save();

    return res.json({msg: "user created!", user: user});
});

exports.update_user = asyncHandler(async (req, res, next) => {
    res.json("Implementation of UPDATE_USER")
});
exports.delete_user = asyncHandler(async (req, res, next) => {
    res.json("Implementation of DELETE_USER")
});
exports.get_user_detail = asyncHandler(async (req, res, next) => {
    res.json("Implementation of GET_USER_DETAIL")
});