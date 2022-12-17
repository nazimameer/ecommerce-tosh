const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;

const orderSchema = new Schema({
    userId:{
        type:String
    },
    deliveryInfo:{
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
          
    },
    productsInfo:[{
        productId:{
            type: ObjectId,
        },
        quantity:{
            type:Number,
        },
    }],
    total:{
        type:Number
    },
    paymentMethod:{
        type:String,
    },
    date:{
        type:Date,
        default: new Date,
    },
    status:{
        type:String,
        default: "Pending",
    },
    orderstatus:{
      type:String,
      default: "Pending",
    }
})
module.exports = mongoose.model('orders', orderSchema)