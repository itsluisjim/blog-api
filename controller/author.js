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

    const userInfo = await User.findById(req.params.id).exec();

    if(userInfo == null){
        const err = new Error("User not found");
        err.status = 404;
        return res.json(err);
    }

    const user = new User({
        _id: req.params.id,
        username: req.body.username,
        first: req.body.first,
        last: req.body.last,
        email: req.body.email,
        hash: userInfo.hash,
        salt: userInfo.salt,
        admin: userInfo.admin
    });

    await User.findByIdAndUpdate(req.params.id, user, {});

    return res.json({msg: "User Updated!", user: user})
});
exports.delete_user = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.params.id).exec();

    if (user === null) {
        return res.json('User not found!')
    } else {
        await User.findByIdAndDelete(req.body.userId);
        res.json("User was deleted successfully!")
    }
});
exports.get_user_detail = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).exec();

    res.json(user);
});