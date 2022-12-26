const mongoose= require('mongoose')
const Schema = mongoose.Schema;

const ObjectId = Schema.Types.ObjectId;


const wishlistSchema = new mongoose.Schema({
    userId:{
        type:ObjectId,
    },
    products:[
        {
          productId: {
            type: ObjectId,
            ref: "products",
          },
        },
      ]
})
module.exports = mongoose.model('wishist', wishlistSchema)
