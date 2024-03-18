const express = require("express");
const router = express.Router();

const comment_controller = require("../controller/comment");

router.get('/', comment_controller.get_all_comments);
router.post('/create',comment_controller.create_comment);

// Admin Routes
router.get('/:id', comment_controller.get_comment_detail);
router.delete('/:id/delete', comment_controller.delete_comment);

module.exports = router;