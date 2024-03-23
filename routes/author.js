const express = require("express");
const router = express.Router();

const author_controller = require('../controller/author');

router.get('/', author_controller.list_all_authors);
router.put('/:id/update', author_controller.update_user);
router.get('/:id', author_controller.get_user_detail)

// // Admin Routes
router.delete('/:id/delete', author_controller.delete_user)

module.exports = router;