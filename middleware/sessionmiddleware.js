const mongoose =require('mongoose')
const userModel = require('../models/userSchema')




module.exports = {
    verifyLoginAdmin:(req,res,next)=>{
        if(req.session.admin){
            next()
        }else{
            res.redirect('/admin');
        }
    },
    verifyLoginUser:async(req,res,next)=>{
        const id = req.session.user
        const userid = mongoose.Types.ObjectId(id)
        const userDoc = await userModel.findOne({ _id: userid });

        if(req.session.user && userDoc.blockStatus==false){
            next()
        }else{
            req.session.destroy();
            res.redirect("/log_in")
        }
    }
} 