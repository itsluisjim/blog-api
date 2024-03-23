const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

require("../config/connection");

exports.list_all_authors = asyncHandler(async (req, res, next) => {
  const list_of_authors = await User.find().sort({ last: 1 }).exec();
  return res.json(list_of_authors);
});


exports.update_user = [
  body('username')
    .trim()
    .escape()
    .isLength({min: 8})
    .withMessage('Username must be longer than 8 characters')
    .isAlphanumeric()
    .withMessage("Username has non-alphanumeric characters."),

    body('first')
    .trim()
    .isLength({min: 2})
    .escape()
    .withMessage("First name must be longer than 2 characters.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),

  body('last')
    .trim()
    .isLength({min: 2})
    .escape()
    .withMessage("Last name must be longer than 2 characters.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters."),

    asyncHandler(async (req, res, next) => {

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map(error => ({
            message: error.msg
        }));
        return res.status(400).json({ errors: errorMessages });
    }
    
      const userInfo = await User.findById(req.params.id).exec();
    
      if (userInfo == null) {
        const err = new Error();
        err.status = 404;
        err.message = "User not found";
        return res.json(err);
      }
    
      const user = new User({
        _id: req.params.id,
        username: req.body.username,
        first: req.body.first,
        last: req.body.last,
        email: userInfo.email,
        hash: userInfo.hash,
        salt: userInfo.salt,
        admin: userInfo.admin,
      });
    
      await User.findByIdAndUpdate(req.params.id, user, {});
    
      return res.json({ msg: "User Updated!", user: user });
    })
];

exports.delete_user = asyncHandler(async (req, res, next) => {
  
  if(req.body.userId == null || req.body.userId == "") {
    const err = new Error();
    err.status = 404;
    err.message = "User ID not provided!";
    return res.json(err);
  }

  const user = await User.findById(req.params.id).exec();

  if (user === null) {
    const err = new Error();
    err.status = 404;
    err.message = "User not found!";
    return res.json(err);
  } else {
    await User.findByIdAndDelete(req.body.userId);
    return res.json("User was deleted successfully!");
  }
});
exports.get_user_detail = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();

  if (user === null) {
    const err = new Error();
    err.status = 404;
    err.message = "User not found!";
    return res.json(err);
  }

  return res.json(user);
});