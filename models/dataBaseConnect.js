const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/")
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    if (err) console.log("not connected");
  });
