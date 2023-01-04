const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type:String,
    
  },
  blockStatus: {
    type: Boolean, 
    default: false 
 },
});

module.exports = mongoose.model("category", categorySchema);
 