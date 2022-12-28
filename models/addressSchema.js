const mongoose = require("mongoose");

const ObjectId = mongoose.Types.ObjectId;

const addressSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    ref: "Signupdetails",
  },
    primaryAddress: {
        username: {
          type: String,
        },
        mobile: {
          type: Number,
        },
        email: {
          type: String,
        },
        postcode: {
          type: Number,
        },
        area:{
          type:String,
        },
        district: {
          type: String,
        },
        state:{
          type: String,
        },
        landmark:{
          type: String,
        },
    },
    secondaryAddress:{
      username: {
        type: String,
      },
      mobile: {
        type: Number,
      },
      email: {
        type: String,
      },
      postcode: {
        type: Number,
      },
      area:{
        type:String,
      },
      landmark:{
        type: String,
      },
      district: {
        type: String,
      },
      state:{
        type: String,
      },
    }
});

module.exports = mongoose.model("address", addressSchema);
