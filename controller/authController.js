const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const { isValidPassword, generatePassword } = require("../lib/passwordUtils");

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

    if (!hashMatch) {
      const err = new Error();
      err.status = 401;
      err.message = "Auth Failed: Incorrect Username/Password";

      return res.json(err);
    }

    const newUser = {
      username: user.username,
      email: user.email,
      first: user.first,
      last: user.last,
      admin: user.admin,
      _id: user._id,
    };

    const opts = {
      expiresIn: 3600,
    };

    const secret = process.env.SECRET;

    const token = jwt.sign({ newUser }, secret, opts);

    return res.status(200).json({
      message: "Authentication Successfull",
      data: {
        user: newUser,
        token,
      },
    });
  }),
];

exports.signup_user = [
  body("username")
    .trim()
    .escape()
    .isLength({ min: 8 })
    .withMessage("Username must be longer than 8 characters")
    .isAlphanumeric()
    .withMessage("Username has non-alphanumeric characters."),

  body("first")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("First name must be longer than 2 characters.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),

  body("last")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Last name must be longer than 2 characters.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters."),

  body("email").trim().escape().isEmail(),

  body("password")
    .trim()
    .isLength({ min: 8 })
    .escape()
    .matches(/^(?=.*[A-Z])/)
    .withMessage("Password must have an uppercase letter.")
    .matches(/^(?=.*[a-z])/)
    .withMessage("Password must have a lowercase letter.")
    .matches(/^(?=.*\d)/)
    .withMessage("Password must have at least one digit.")
    .matches(/^(?=.*[!@#$%])/)
    .withMessage(
      "Password must have at least one of the following symbols (!,@,#,$,%)"
    ),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((error) => ({
        message: error.msg,
      }));
      return res.status(400).json({ errors: errorMessages });
    }

    const saltHash = generatePassword(req.body.password);

    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const user = new User({
      username: req.body.username,
      first: req.body.first,
      last: req.body.last,
      email: req.body.email,
      hash: hash,
      salt: salt,
      admin: false,
    });
    await user.save();

    const opts = {
      expiresIn: 3600,
    };

    const cleanPayload = {
      username: user.username,
      email: user.email,
      first: user.first,
      last: user.last,
      admin: user.admin,
      _id: user._id,
    };

    const secret = process.env.SECRET;

    const token = jwt.sign({ cleanPayload }, secret, opts);

    return res.status(200).json({
      message: "User creation successful!",
      data: {
        user: cleanPayload,
        token,
      },
    });
  })
];
