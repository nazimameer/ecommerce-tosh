const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    if (err) console.log("not connected");
  });