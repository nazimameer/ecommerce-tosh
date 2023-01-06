const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const couponSchema = new Schema({
        CODE:{
            type:String,
        },
        PERCENTAGE:{
            type:Number,
        },
        LIMIT:{
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