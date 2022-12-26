const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const couponSchema = new Schema({
        CODE:{
            type:String,
        },
        PRICE:{
            type:Number,
        },
        EXPIRE:{
            type:Date,
            
        },
        userId:[{
               _id:{
                   type: ObjectId,
               } 
            } 
        ]
  });
  
  module.exports = mongoose.model("coupons", couponSchema);