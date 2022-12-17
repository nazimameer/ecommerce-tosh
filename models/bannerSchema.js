const mongoose = require('mongoose')

const bannerSchema = new mongoose.Schema({

    bannername:{
        type:String,
        required:true
    },
    text:{
        type:String,
        required:true,
    },
    blockStatus: {
        type: Boolean,
        default: false 
       },
    
})

module.exports = mongoose.model("banners",bannerSchema)