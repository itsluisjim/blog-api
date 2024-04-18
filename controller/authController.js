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
      return res.status(404)
        .json({
          errors: [{ 
            message:"Incorrect Username/Password" 
          }]
        });
    }

    const hashMatch = isValidPassword(password, user.hash, user.salt);

    if (!hashMatch) {
      return res.status(401)
        .json({
          errors: [{ 
            message:"Incorrect Username/Password" 
          }]
        });
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
    .toLowerCase()
    .isLength({ min: 8 })
    .withMessage("Username must be longer than 8 characters")
    .isAlphanumeric()
    .withMessage("Username has non-alphanumeric characters."),

  body("first")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("First name must be longer than 2 characters.")
    .isAlpha()
    .withMessage("First name must contain only alphabetical characters."),

  body("last")
    .trim()
    .isLength({ min: 2 })
    .escape()
    .withMessage("Last name must be longer than 2 characters.")
    .isAlpha()
    .withMessage("Last name must contain only alphabetical characters."),

  body("email").trim().escape().toLowerCase().isEmail(),

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
    
    const username = req.body.username;
    const email = req.body.email

    const [ usernameTaken, emailTaken ] = await Promise.all([
      User.exists({username}).exec(),
      User.exists({email}).exec()
    ]);

    if (usernameTaken && emailTaken) {
      return res.status(409)
        .json({
          errors: [{ 
            message: 'Username and Email are taken!'
          }]
        });
    } else if (usernameTaken) {
      return res.status(409)
        .json({
          errors: [{ 
            message: 'Username is taken!'
          }]
        });
    } else if (emailTaken) {
      return res.status(409)
        .json({
          errors: [{ 
            message: 'Email is taken!'
          }]
        });
    } else {
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
  
      const token = jwt.sign({ newUser: cleanPayload }, secret, opts);
  
      return res.status(200).json({
        message: "User creation successful!",
        data: {
          user: cleanPayload,
          token,
        },
      });
    }
  })
];
