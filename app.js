const express = require("express");
const authorRoute = require('./routes/author');

const app = express();

require('./config/connection');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/author', authorRoute);


app.listen(3000);