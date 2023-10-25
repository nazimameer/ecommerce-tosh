const mongoose = require("mongoose");

mongoose
  .connect(process.env.DBURI)
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    if (err) console.log("not connected");
  });
