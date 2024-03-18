const express = require("express");
const authorRoute = require('./routes/author');
const postRoute = require('./routes/post');
const commentRoute = require('./routes/comment');

const app = express();

require('./config/connection');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/authors', authorRoute);
app.use('/posts', postRoute);
app.use('/comments', commentRoute);


app.listen(3000);