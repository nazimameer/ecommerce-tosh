const mongoose = require("mongoose");

const url = process.env.MONGODB;

function dbConnect() {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(url)
    .then(() => console.log("database connected"))
    .catch((err) => console.log(err));
}

module.exports = dbConnect;