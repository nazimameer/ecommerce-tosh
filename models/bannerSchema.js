const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({

    bannername:{
        type:String,
    },
    text:{
        type:String,
    },
    blockStatus: {
        type: Boolean,
        default: false 
       },
    
})

module.exports = mongoose.model("banners",bannerSchema)