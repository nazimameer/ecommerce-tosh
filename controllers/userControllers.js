const mongoose =require('mongoose');
const UserModel = require("../models/userSchema");
const productModel = require("../models/productSchema");
const cartModel = require("../models/cartSchema");
const categoryModel = require("../models/categorySchema");
const addressModel = require('../models/addressSchema')
const bannerModel = require('../models/bannerSchema')
const mailer = require('../middleware/otp')
const orderModel = require('../models/orderSchema')
const Razorpay = require('razorpay');
const couponModel = require('../models/couponSchema')
const wishlistModel = require('../models/whishlist')

var instance = new Razorpay({
  key_id: 'rzp_test_At7vVgtlG23Lyo',
  key_secret: '3hR36qbgrFTGG3FBHKV8b2iX',
});

let ship;
let userdata ; 
let cartcount=0;

// Regex email and password
const emailRegex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

// check email exist on database
async function emailExists(userId) {
  const Userfound = await UserModel.findOne({ email: userId });
  if (Userfound) {
    return true; // Email Exists
  }
  return false;
}

function subtotal(a){
  const user =a;
  const userId = mongoose.Types.ObjectId(user);
  return new Promise ((resolve,reject)=>{
    cartModel.aggregate([
      {
        $match:{
          userId
        },
      },
      {
        $unwind: "$items",
      },
      {
        $project:{
          productItem: "$items.productId",
          productQuantity: "$items.quantity",
        },
      },
      {
        $lookup:{
          from: "products",
          localField: "productItem",
          foreignField: "_id",
          as:"productDetails"
        },
      },
      {
          $project:{
            productItem: 1,
            productQuantity:1,
            productDetails : {
              $arrayElemAt:['$productDetails',0]
            },
        },
      },
      {
        $group:{
          _id:userId,
          total:{$sum:{$multiply:['$productQuantity','$productDetails.price']}}
        }
      }
    ]).then((total)=>{
      resolve(total)
    })
})
}

function generateRazorpay(orderId,totalprice){
  return new Promise((resolve,reject)=>{
    instance.orders.create({
      amount: totalprice,
      currency: "INR",
      receipt: orderId.toString(),
      notes: {
        key1: "value3",
        key2: "value2"
      }
    }).then((order)=>{
      console.log("new Order:",order);
      resolve(order)
    })
  })
}
function varifyPayment(details){

  return new Promise ((resolve,reject)=>{

    const crypto = require('crypto')
    let hmac = crypto.createHmac('sha256', '3hR36qbgrFTGG3FBHKV8b2iX')
    hmac.update( details.payment.razorpay_order_id +'|'+ details.payment.razorpay_payment_id )
    hmac=hmac.digest('hex')
    if(hmac==details.payment.razorpay_signature){
      resolve()
    }else{
      reject()
    }
  })

}

// All Controllers
module.exports = {
  goHome: async (req, res) => {
    if (req.session.user) {
      const products = await productModel.find({ blockStatus:false });
      const cats = await categoryModel.find({});
      const banners = await bannerModel.find({ blockStatus: false })
      res.render("user/home", { products, cats, banners, user:true, cartcount });
      
    }
    else {
      const products = await productModel.find({ blockStatus:false });
      const cats = await categoryModel.find({});
      const banners = await bannerModel.find({ blockStatus: false })
       res.render("user/home", { products, cats, banners, user: false, cartcount  });
     }
  },
  goToSignup: (req, res) => {
    res.render("user/signup", { msg: "" });
  },
  goToLogin: (req, res) => {
    res.render("user/login", { msg: "" });
  },
  sendToDatabase: async (req, res) => {
    
 let otp = req.body.otp;
  if(mailer.OTP == otp){
    const data = req.body

    const newUser = new UserModel({
      username: userdata.username,
      email: userdata.email,
      password: userdata.password,
    }); 
    newUser.save().then(() => { 
      res.redirect("/log_in");
    });

  }else{

    res.render('user/otp')
  }
  },


  doLogin: async (req, res) => {
    try {
      if (
        emailRegex.test(req.body.email) &&
        passwordRegex.test(req.body.password)
      ) {
        const userDoc = await UserModel.findOne({ email: req.body.email });

        if (userDoc.password == req.body.password) {
          if (userDoc.blockStatus == true) {
            res.render("user/login", { msg: "You were blocked by Admin" });
          } else {
            req.session.user = userDoc._id;
            res.redirect("/");
          }
        } else {
          res.render("user/login", { msg: "Invalid credentials!!" });
        }
      } else if (
        emailRegex.test(req.body.email) == false &&
        passwordRegex.test(req.body.password) == false
      ) {
        res.render("user/login", { msg: "Invalid email or Password" });
      } else if (emailRegex.test(req.body.email) == false) {
        res.render("user/login", { msg: "Enter a Valid Email Address" });
      } else if (passwordRegex.test(req.body.password) == false) {
        res.render("user/login", { msg: "Incorrect Password" });
      } else {
        res.render("user/login", { msg: "Someting Went Wrong" });
      }
    } catch { 
      res
        .status(400)
        .render("user/404", { msg: "invalid credentials!! Try Again" });
    }
  },
  getProductInfo: (req, res) => {
    productModel.find({ _id: req.params.id }).then((infos) => {
      res.render("user/home", { infos, cartcount });
    });
  },
  viewCart: async (req,res)=>{

    
      const user = req.session.user;
      const userId = mongoose.Types.ObjectId(user);
      const Allcart = await cartModel.aggregate([
        {
          $match:{
            userId
          },
        },
        {
          $unwind: "$items",
        },
        {
          $project:{
            productItem: "$items.productId",
            productQuantity: "$items.quantity",
          },
        },
        {
          $lookup:{
            from: "products",
            localField: "productItem",
            foreignField: "_id",
            as:"productDetails"
          },
        },
        {
            $project:{
              productItem: 1,
              productQuantity:1,
              productDetails : {
              $arrayElemAt:['$productDetails',0]
            },
          },
        },
      ])
      let cartcount = await Allcart.length;
      
      console.log(Allcart)
      let total = await subtotal(user)
      if(total[0]){
       ship = 70;
        const grandTotal = total[0].total + ship;
          res.render('user/cart',{ Allcart, total: total[0].total, grandTotal, cartcount});
      }else{
        total = 0;
       const grandTotal = 0;
        res.render('user/cart',{ Allcart, total, grandTotal,cartcount});
      }
      
  },
  addToCart: async (req, res) => {
    const data = req.body;
    const id = data.product;
    const objId = mongoose.Types.ObjectId(id);
    const user = req.session.user;
    const proObj = {
      productId: objId,
    };
    const userCart = await cartModel.findOne({ userId: user });

    if (userCart) {

      const proExist = userCart.items.findIndex((pro) => pro.productId == id);

      if (proExist !== -1) {

        await cartModel.aggregate([
          {
            $unwind: "$items",
          },
        ]);

        await cartModel.updateOne(
          { userId: user, "items.productId": objId },
          { $inc: { "items.$.quantity": 1 } }
        );
        res.redirect("/");
      } else {

        cartModel.updateOne({ userId: user },{$push:{ items: proObj }}).then(()=>{})
        res.json({ status: true });

      }
    } else {
      cartModel.create({
        userId: user,
        items: [
          {
            productId: objId,
            quantity: 1,
          },
        ],
      });
     cartcount = await userCart.length;
      res.json({ status: true });
    }
  },
  deleteInCart:async(req,res)=>{
    const data = req.body;

    const objId = mongoose.Types.ObjectId(data.product)

    await cartModel.aggregate([
      {
         $unwind:'$items' 
      }
    ]).then(()=>{})

    await cartModel.updateOne(
      { _id: data.cart, "items.productId": objId },
    { $pull:{ items:{ productId: objId }}}
    ).then(()=>{
      res.json({ status: true }) 
    })

  },
  productzoom: async (req, res) => {
   const id = req.session.user;
   const userid = mongoose.Types.ObjectId(id)
   const productId = req.params.id
   const objId = mongoose.Types.ObjectId(productId) 
    const zproduct = await productModel.findOne({ _id: req.params.id });
    const wishlist = await wishlistModel.findOne({ userId:userid, products:{ $elemMatch:{ productId: objId }}})
    res.render("user/zoomproduct", { zproduct,cartcount,wishlist });
  },
  changeProQuantity: async(req,res,next)=>{
    try{

      const data = req.body;

      const objId = mongoose.Types.ObjectId(data.product)

      await cartModel.aggregate([
        {
          $unwind: '$items',
        },
      ]).then(() => {
      });
    
      await cartModel.updateOne(
        { _id:data.cart, 'items.productId': objId },
        { $inc:{ 'items.$.quantity': data.count  } }
      ).then(()=>{
        next()
      })
    }catch{
      res.render('user/404')
    }
  },
  subtotal:(req,res)=>{
    try{

      const user =req.session.user;
      if(user){
        const user =req.session.user;
        const userId = mongoose.Types.ObjectId(user);
      cartModel.aggregate([
        { 
          $match:{
            userId
          },
        },
        {
          $unwind: "$items",
        },
        {
          $project:{
            productItem: "$items.productId",
            productQuantity: "$items.quantity",
          },
        },
        {
          $lookup:{
            from: "products",
            localField: "productItem",
            foreignField: "_id",
            as:"productDetails"
          },
        },
        {
            $project:{
              productItem: 1,
              productQuantity:1,
              productDetails : {
                $arrayElemAt:['$productDetails',0]
              },
          },
        },
        {
          $group:{
            _id:userId,
            total:{$sum:{$multiply:['$productQuantity','$productDetails.price']}}
          }
        }
      ]).then((total)=>{
        ship = 70;
          const grandTotal = total[0].total + ship;
          res.json({ status: true, total, grandTotal })
        })
      }
    }catch{
      res.render('user/404')
    }
  },
toCheckOut:async(req,res)=>{
    const user = req.session.user;
    const total = await subtotal(user)
    const address = await addressModel.findOne({
      userId: user
    })
    if(total[0]){
     ship = 70;
      const grandTotal = total[0].total + ship;
        res.render('user/checkout',{ total: total[0].total, grandTotal,cartcount, address,user });
  } 
},
addAddress:(req,res)=>{
    res.render('user/addsecondary',{cartcount})
},
addAddresstodb:async(req,res)=>{
  
    const id = req.session.user;
    const user = mongoose.Types.ObjectId(id);
    const secondary = await addressModel.updateOne({
       userId : user},{
        $set:
       { 
       secondaryAddress:
      {
        username: req.body.username,
        mobile: req.body.mobile,
        email: req.body.email,
        postcode: req.body.postcode,
        area: req.body.area,
        landmark: req.body.landmark,
        district: req.body.district,
        state: req.body.state,
      }
  }})
      res.redirect('/cart/checkout')
},
  toProfilePage:async(req,res)=>{
    const id = req.session.user;
    const user = mongoose.Types.ObjectId(id);
    const address = await addressModel.findOne({ userId: user})
    res.render('user/profile',{ cartcount, address })
},
AddPrimary:async (req,res)=>{
  const id = req.session.user;
  const user = mongoose.Types.ObjectId(id);

  const newaddress = await addressModel.insertMany({
      userId:user,
      primaryAddress:
      {
        username: req.body.username,
        mobile: req.body.mobile,
        email: req.body.email,
        postcode: req.body.postcode,
        area: req.body.area,
        district: req.body.district,
        landmark: req.body.landmark,
        state: req.body.state,
      }
  })

  res.redirect('/profile')
  
},
AddPrimarypage:(req,res)=>{

  res.render('user/addprimary',{cartcount})
},
editprimary: async(req,res)=>{
  const id = req.session.user;
  const user = mongoose.Types.ObjectId(id);
    const address = await addressModel.findOne({ userId: user})
    res.render('user/editprimary',{ cartcount, address })
},
otpPage: async(req,res)=>{
  try {
    userdata = req.body;
    const validEmail = req.body.email
    const validPassword = req.body.password
    const mailDetails = {
      from: 'nazimameerpp@gmail.com',
      to: req.body.email,
      subject: "Tosh VERIFICATION",
      html: `<p>YOUR OTP FOR REGISTERING IN TOSH  IS <h1> ${mailer.OTP} <h1> </p>`,
    };
      const userExist = await emailExists(req.body.email);

      if (userExist === true) {

        res.render("user/signup", {

          msg: "User Already Exist Please Try Again",
        });
      }
       else if (req.body.email && req.body.password) {

        mailer.mailTransporter.sendMail(mailDetails,(err,data)=>{
          if (err) {
          console.log(err);
            
          } else {
            res.render('user/otp')
          }
        })
      } else {

        res.render("user/signup", { msg: "something went wrong" });
      }
  } catch (error) {
    res.render("user/404", { msg: "error" });
  }

},
editprimaryadd: async(req,res)=>{
  const id = req.session.user;
  const user = mongoose.Types.ObjectId(id);
  const priadd = await addressModel.updateOne({
    userId: user
  },
  {$set:{
    primaryAddress:{
      username: req.body.username,
      mobile: req.body.mobile,
      email: req.body.email,
      postcode: req.body.postcode,
      area: req.body.area,
      district: req.body.district,
      landmark: req.body.landmark,
      state: req.body.state,
    }
  }})
  console.log(priadd);
  res.redirect('/profile')
},
editSecondaryAdd:async(req,res)=>{
  const id = req.session.user;
  const user = mongoose.Types.ObjectId(id);
  const secadd = await addressModel.updateOne({
    userId: user
  },
  {$set:{
    secondaryAddress:{
      username: req.body.username,
      mobile: req.body.mobile,
      email: req.body.email,
      postcode: req.body.postcode,
      area: req.body.area,
      district: req.body.district,
      landmark: req.body.landmark,
      state: req.body.state,
    }
  }})
  res.redirect('/cart/checkout')
},
placeOrder: async(req,res)=>{
  const paymentmethod = req.body.paymentmethod;
  const total = req.body.totalprice;
  const totalprice = total*100;
  const user= req.session.user;
  const orderst = paymentmethod === 'Cash on delivery'?'Placed':'PENDING'; 
  const addresstype = req.body.address;
  const address = await addressModel.findOne({ userId: user }) 
  const cart = await cartModel.findOne({ userId: user})
  const cartitems = cart.items;
  let Daddress;
  if(addresstype==='primaryaddress'){
     Daddress = address.primaryAddress;
  }else if(addresstype==='secondaryaddress'){
     Daddress = address.secondaryAddress;
  }

 const order = await orderModel.create({
    userId: user,
    deliveryInfo:{
      username: Daddress.username,
      mobile: Daddress.mobile,
      email: Daddress.email,
      postcode: Daddress.postcode,
      area: Daddress.area,
      landmark: Daddress.landmark,
      district: Daddress.district,
      state: Daddress.state
    },
    productsInfo: cartitems,
    total: total,
    paymentMethod: paymentmethod,
    status: orderst,
    orderstatus: orderst,
    })
    const orderId = order._id;

    if(paymentmethod === "Cash on delivery"){

      res.json({ success: true })
    }else if(paymentmethod === "onlinepayment"){
      generateRazorpay(orderId,totalprice).then((re)=>{

        res.json(re)
      })
    }

},
applycoupon:async(req,res)=>{
  const data = req.body
  const user = req.session.user;
  const userid =mongoose.Types.ObjectId(user)
  const coupon = data.coupon;
  const grandTotal = data.grandTotal;
  const couponExist = await couponModel.findOne({ CODE: coupon })
  const couponPrice = couponExist?.PRICE;
  const id = couponExist?._id;
  const couponid = mongoose.Types.ObjectId(id)
  if(couponExist){
    const userExist = await couponModel.findOne({
      userId:[{
        user: userid
      }]
    })
    if(userExist){
      res.json({ success:false })
    }else{
      await couponModel.updateOne({ user:couponid },
        {userId:{ $push:{ _id: userid  }}})
        const newtotal = grandTotal-couponPrice;
        res.json({ success:true, newtotal })
        console.log(newtotal)
    }
  }else{
    res.json({ success:false })
  }
},
towishlist:async(req,res)=>{
  const user = req.session.user;
  const userid = mongoose.Types.ObjectId(user)
  const wishlist = await wishlistModel.aggregate([
    {
      $match:{
        userId: userid
      },
    },
    {
      $unwind: "$products",
    },
    {
      $project:{
        productItem: "$products.productId",
      },
    },
    {
      $lookup:{
        from: "products",
        localField: "productItem",
        foreignField: "_id",
        as:"productDetails"
      },
    },
    {
        $project:{
          productItem: 1,
          productQuantity:1,
          productDetails : {
          $arrayElemAt:['$productDetails',0]
        },
      },
    },
  ])
  res.render('user/wishlist',{ cartcount, wishlist })
},
editSecondary:async(req,res)=>{
  const id = req.session.user;
  const user = mongoose.Types.ObjectId(id);
    const address = await addressModel.findOne({ userId: user})
  res.render('user/editsecondary',{ cartcount, address})
},
varifyPayment:(req,res)=>{
  const datas = req.body
  varifyPayment(req.body).then(async()=>{
    const id = datas.order.receipt;
    const orderId = mongoose.Types.ObjectId(id);
    await orderModel.updateOne({ _id:orderId },{$set:{ status:'Placed', orderstatus:'Placed'}})
    res.json({ status:true })
  }).catch((err)=>{
    console.log('error:',err);
    res.json({ status:false })
  })
},
toMyorders:async(req,res)=>{
  const id= req.session.user
  const orders = await orderModel.find({userId:id,status:"Placed"})
  res.render('user/myorders',{ cartcount, orders })
},
cancelOrder:async(req,res)=>{
  const data = req.body;
  const id = data.orderId;
  const orderId = mongoose.Types.ObjectId(id);
   
  await orderModel.findOneAndUpdate(
    { _id: orderId },
    { status: 'Cancelled',orderstatus:'Cancelled' })
  
    res.json({ status: true })
},
orderedPro:async(req,res)=>{
  const id = req.params.id;
  const orderId = mongoose.Types.ObjectId(id);

  const products = await orderModel.aggregate([
    { 
      $match:{
        _id: orderId
      },
    },
    {
      $unwind: "$productsInfo",
    },
    {
      $project:{
        productItem:"$productsInfo.productId" ,
        productQuantity: "$productsInfo.quantity",
      },
    },
    {
      $lookup:{
        from: "products", // from which collection
        localField: "productItem", // where the matching prop is
        foreignField: "_id", // what need to match
        as:"productDetails" // into which key
      },
    },
    {
        $project:{
          productItem: 1, // 1 for view it
          productQuantity:1,
          productDetails : {
            $arrayElemAt:['$productDetails',0] // starts from
          },
      },
    },
  ])
  res.render('user/orderedpro',{ products, cartcount })
  
},
addtowishlist:async(req,res)=>{
  const data = req.body;
  const user = req.session.user;
  const userid = mongoose.Types.ObjectId(user)
  const productId = data.product;
  const objId = mongoose.Types.ObjectId(productId)
  const proObj = {
    productId: objId,
  };
  const userExist = await wishlistModel.findOne({ userId: userid })
  if(userExist){
    const productExist = await wishlistModel.findOne({ userId:userid, products:{ $elemMatch:{ productId: objId } }})
    if(productExist){
        res.json({success:false})
    }else{
      await wishlistModel.updateOne(
        { userId:userid },{$push:{ products: proObj }}).then(()=>{
          res.json({ success:true })
        })
    }
  }else{
    await wishlistModel.create({ userId: userid, products:[{
      productId: objId
    },
    ],
  });
    res.json({ success:true })
  }
},
removewish:async(req,res)=>{
  const user = req.session.user;
  const userid = mongoose.Types.ObjectId(user)
  const data = req.body;
  const productId = data.product;
  const objId = mongoose.Types.ObjectId(productId)
  const proObj = {
    productId: objId,
  };
  await wishlistModel.updateOne(
    { userId:userid },{$pull:{ products: proObj }}).then(()=>{
      res.json({ success:true })
    })
},
  doUserLogout:(req, res) => {
    req.session.destroy();
    res.redirect("/");
  },
};
  