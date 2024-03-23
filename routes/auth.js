const express = require("express");
const router = express.Router();

const author_controller = require('../controller/author');
const auth_controller = require('../controller/authController');

router.post('/signup', author_controller.create_user);
router.post('/login', auth_controller.login_user);

module.exports = router;