const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const isValidPassword = require("../lib/passwordUtils").isValidPassword;

const User = require("../models/user");

exports.login_user = [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage("Username must be longer than 8 characters")
    .isAlphanumeric()
    .withMessage("Username has non-alphanumeric characters."),

  body("password").trim().notEmpty().withMessage("Please enter a password."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => ({
        message: error.msg,
      }));
      return res.status(400).json({ errors: errorMessages });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username })
      .collation({ locale: "en", strength: 2 })
      .exec();

    if (user == null) {
      const err = new Error();
      err.status = 404;
      err.message = "Username does not exist.";

      return res.json(err);
    }

    const hashMatch = isValidPassword(password, user.hash, user.salt);

    if(!hashMatch){
        const err = new Error();
        err.status = 401;
        err.message = "Auth Failed: Incorrect Username/Password";

      return res.json(err);
    }

    const opts = {
        expiresIn: 3600
    }
    
    const secret = process.env.SECRET;

    const token = jwt.sign({user}, secret, opts);

    return res.status(200).json({
        message: 'Authentication Successfull',
        token
    });
  }),
];
