const express = require('express');
const router = express.Router();

const authorRoute = require('./author');
const postRoute = require('./post');
const commentRoute = require('./comment');

router.use('/authors', authorRoute);
router.use('/posts', postRoute);
router.use('/comments', commentRoute);

module.exports = router;