const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const cartSchema = new Schema({
  userId: {
    type: ObjectId,
    ref: "Signupdetails",  
  }, 
  items: [
    {    
      productId: {
        type: ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});

module.exports = mongoose.model("carts", cartSchema);
