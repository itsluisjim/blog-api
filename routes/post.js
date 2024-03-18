const express = require("express");
const router = express.Router();
const post_controller = require('../controller/post');

router.get('/', post_controller.get_all_posts);
router.post('/create', post_controller.create_post);
router.put('/:id/update', post_controller.update_post);

// Admin Routes
router.get('/:id', post_controller.get_post_details);
router.delete('/:id/delete', post_controller.delete_post);

module.exports = router;