const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  stock: {
    type: Number,
  },
  blockStatus: {
     type: Boolean, 
     default: false 
    },

});

module.exports = mongoose.model("products", productSchema);
