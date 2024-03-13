const express = require("express");

const app = express();

require('./config/connection');


app.get("/", (req, res, next) => {
  const msg = {
    message: "hello world!",
  };

  return res.json(msg);
});

app.listen(3000);
