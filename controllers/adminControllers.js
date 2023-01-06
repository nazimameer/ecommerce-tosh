/* eslint-disable prefer-destructuring */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prefer-template */
/* eslint-disable no-console */
const path = require("path");
const mongoose =require('mongoose')
const UserModel = require("../models/userSchema");
const productModel = require("../models/productSchema");
const categoryModel = require("../models/categorySchema");
const bannerModel = require('../models/bannerSchema')
const orderModel = require('../models/orderSchema');
const couponModel = require('../models/couponSchema')
const excelJs = require('exceljs')
require('dotenv').config();

// username & password of admin
const adminUserName = process.env.ADMINID;
const adminPassword = process.env.ADMINPASSWORD;




module.exports = {
  toAdminHome: (req, res) => {
    if (req.session.admin) {
      res.redirect("/admin/dashboard");
    
    }else if(req.session.loggedIn==true){
      res.redirect("/admin/dashboard");

    }
     else {
      res.render("admin/signin", { msg: "" });
    }
  },
  toAdminDash: async (req, res) => {
    try{
      const dborders = await orderModel.find({})
      if(dborders.length==0){
      res.render("admin/dashboard",{ admin: true, deliveredOrders:0, shippedOrders:0, pendingOrders:0, confirmOrders:0, cancelOrders:0,orders:0,orderpers:0,totalsale:0,salespers:0,revenue:0,revenuepers:0,cost:0,costpers:0 });
         
      }else{

        const deliveredOrders = await orderModel.countDocuments({ orderstatus:"Delivered"})
        const shippedOrders = await orderModel.countDocuments({ orderstatus:"Shipped"})
        const pendingOrders = await orderModel.countDocuments({ orderstatus:"PENDING"})
        const confirmOrders = await orderModel.countDocuments({ orderstatus:"Confirmed"})
        const cancelOrders = await orderModel.countDocuments({ orderstatus:"Cancelled"})
        const orders = await orderModel.countDocuments({})
        const wholestock = await productModel.aggregate([{$group:{_id:'',"stock":{$sum: '$stock' }}}, {$project: {_id: 0,"TotalAmount": '$stock'}}]);
        const orderedstock = await orderModel.aggregate([{$unwind:"$productsInfo"},{$group:{_id:'',count:{$sum:'$productsInfo.quantity'}}},{$project:{_id:0,"count":"$count"}}])
        const orderpers = (orderedstock[0].count/wholestock[0].TotalAmount)*100;
        const sales = await orderModel.aggregate([
            {$group:{_id:'',"total":{$sum:'$total'}}},{$project:{_id:0,'totalsale':'$total'}}
          ])
        const totalsale = sales[0].totalsale;
        const wholeworth = await productModel.aggregate([{$project:{price:1,stock:1, total:{ $multiply:["$price","$stock"] }}},{$group:{ _id:'',"total":{$sum:"$total"}}},{$project:{_id:0,'wholeprice':"$total"}}])
        const wholeworthprice =  wholeworth[0].wholeprice;
        console.log(wholeworthprice)
        const salespers = (totalsale/wholeworthprice)*100; 
        const revenue = (totalsale*30)/100;
        const totalrevenue = (wholeworthprice*30)/100;
        const revenuepers = (revenue/totalrevenue)*100;
        const cost = (totalsale*70)/100;
        const totalcost = (wholeworthprice*70)/100;
        const costpers = (cost/totalcost)*100;
        console.log(totalcost)
    
      
    
        res.render("admin/dashboard",{ admin: true, deliveredOrders, shippedOrders, pendingOrders, confirmOrders, cancelOrders,orders,orderpers,totalsale,salespers,revenue,revenuepers,cost,costpers });
      
      }

    }catch(err){
      console.log(err)
    }
  },
  listUsers: async (req, res) => {  
    try {
      await UserModel.find({}).then((users) => {
        res.render("admin/users", { users });
      });
    } catch (error) {
      res.render("admin/404");
    }
  },
  toAdminSignin: (req, res) => {
    console.log(process.env.ADMINID,process.env.ADMINPASSWORD)
    if (
      req.body.username === process.env.ADMINID &&
      req.body.password === process.env.ADMINPASSWORD
     
    ) {
      req.session.admin = req.body.username;
      req.session.loggedIn = true;
      res.redirect("/admin/dashboard");
    } else {
      res.render("admin/signin", { msg: "Incorrect Password" });
    }
  },
  doAdminLogout: (req, res) => {
    req.session.loggedIn = false;
    req.session.destroy();
    res.redirect("/admin");
  },
  blockUser: async (req, res) => {
    console.log(req.params.id);
    await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { blockStatus: true } }
    ).then(() => {
      req.session.blockInfo = true;
      req.session.unblockInfo = false;
    });
    res.redirect("/admin/user_details");
  },

  unblockUser: async (req, res) => {
    UserModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { blockStatus: false } }
    ).then(() => {
      req.session.blockInfo = false;
      req.session.unblockInfo = true;
    });
    res.redirect("/admin/user_details");
  },

  toUsers: (req, res) => {
    res.redirect("/admin/users");
  },
  listProducts: async (req, res) => {
    try {
      await productModel.find({}).then((products) => {
        res.render("admin/products", { products });
      });
    } catch (error) {
      console.log("error");
    }
  },
  viewAddProduct: async(req, res) => {
    const cats = await categoryModel.find({})
    res.render("admin/addproducts",{ msg:"",cats });
  },

  goToEditProduct: (req, res) => {
    productModel.find({ _id: req.params.id }).then((info) => {
      res.render("admin/editproduct", { info });
    });
  },
  editProduct: async (req, res) => {
    

      if(req.body){
        await productModel.replaceOne(
         { _id: req.params.id },
         { name: req.body.name, price: req.body.price, stock: req.body.stock }
       );
      }
        if(req.files!=null){
          console.log('jesl')
          const editImage = req.files.image;
          const editImageName = req.params.id;
          editImage.mv(
            path.join(__dirname, "../public/ProductImg/") + editImageName + ".jpg"
          );
          
        }
        console.log('halo')

      res.redirect("/admin/products_details");
   
   
  },
  
  toCategory: async (req, res) => {
    const cats = await categoryModel.find({});

    res.render("admin/category", { cats });
  },
  addCategory: (req, res) => {
    res.render("admin/addCategory",{msg:""});
  },
  addCategoryTOdb: async (req, res) => {
    const catname = req.body.name;
    const catExist = await categoryModel.findOne({ name:catname })
  if(catExist){
    res.render("admin/addCategory", { msg:"category already exist" });
  }else{
    const addcat = await categoryModel.create({ name: req.body.name });
    const image = req.files.Image;
    const imageName = addcat._id;
    image.mv(
      path.join(__dirname, "../public/CategoryImg/") + imageName + ".jpg"
    );
    
    res.redirect("/admin/category_details");
  }
  },

  AddProduct: async (req, res) => {
    const proname = req.body.name;
    const proExist = await productModel.findOne({ name:proname })
    const category = req.body.cats;
    console.log(category)
    const cats = await categoryModel.find({ blockStatus:false })
    if(proExist){
    res.render("admin/addproducts",{ msg:"product already exist",cats });

    }else{
        const addPro = await productModel.create({
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock,
        category: category, 
      });
      const proImage = req.files.image;
      const proImageName = addPro._id;
      proImage.mv(
        path.join(__dirname, "../public/ProductImg/") + proImageName + ".jpg",
        );
        res.redirect("/admin/products_details");
    }
  },
  orders:async(req, res)=>{

    const order = await orderModel.find({ status:"Placed" })
    const orders = order.reverse()
    res.render("admin/orders",{ orders });
  },
  confirmstatus:async(req,res)=>{
    const data = req.body;
    const id = data.orderId;
    const orderId = mongoose.Types.ObjectId(id);
     
    await orderModel.findOneAndUpdate(
      { _id: orderId },
      {$set:{orderstatus:'Confirmed'}})

      res.json({ status: true })
  },
  shippedstatus:async(req,res)=>{
    const data = req.body;
    const id = data.orderId;
    const orderId = mongoose.Types.ObjectId(id);
     
    await orderModel.findOneAndUpdate(
      { _id: orderId },
      {$set:{orderstatus:'Shipped'}})

      res.json({ status: true })
  },
  deliveredstatus:async(req,res)=>{
    const data = req.body;
    const id = data.orderId;
    const orderId = mongoose.Types.ObjectId(id);
     
    await orderModel.findOneAndUpdate(
      { _id: orderId },
      {$set:{orderstatus:'Delivered'}})

      res.json({ status: true })
  },
  restorepro: (req, res) => {
    try {
      productModel.findOneAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: {
            blockStatus: false,
          },
        }
      ).then(() => {
        res.redirect("/admin/products_details");
      });
    } catch {
      res.render("admin/404");
    }
  },
  toBanners:async(req,res)=>{
    const banners = await bannerModel.find({})
    res.render('admin/banners',{ banners })
  },
  tocoupons:async(req,res)=>{
    const coupons = await couponModel.find({})
    res.render('admin/coupons',{ coupons })
  },
  toAddBanner:(req,res)=>{
    res.render('admin/addbanner') 
  },
  addBannerTodb:async(req,res)=>{
    const banner = await bannerModel.create({
      bannername: req.body.bannername,
      text: req.body.text,
    })
    const banImg = req.files.bannerImg
    const banImgName = banner._id
    banImg.mv(
      path.join(__dirname, "../public/BannerImg/") + banImgName + ".jpg"
    );
    res.redirect('/admin/Banners')
  },
  deleteBanner:async(req,res)=>{
      await bannerModel.findOneAndUpdate(
        {_id: req.params.id},
        {$set:{ blockStatus:true }}
      ).then(()=>{
        res.redirect('/admin/Banners')
      })
  },
    restorebanner:async(req,res)=>{
      await bannerModel.findOneAndUpdate({ _id:req.params.id },{$set:{ blockStatus:false }}).then(()=>{
        res.redirect('/admin/Banners')
      })
 },
 goToEditBanner:(req,res)=>{

bannerModel.find({ _id: req.params.id }).then((banners) => {
      res.render("admin/editbanner", { banners });
    });
 },
 EditBanner:async(req,res)=>{
  
    const editedbanner = await bannerModel.replaceOne(
      { _id: req.params.id },
      { bannername: req.body.bannername, text: req.body.text }
    ); 

    const banImg = req.files.bannerImg
    const banImgName = req.params.id
    banImg.mv(
      path.join(__dirname, "../public/BannerImg/") + banImgName + ".jpg"
    );
    res.redirect("/admin/Banners");
},
orderedpro:async(req,res)=>{
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

  const address = await orderModel.findOne({ _id:orderId})
  res.render('admin/orderedpro',{ products,address })
},
salesreport:async(req,res)=>{
    const currentYear = new Date().getFullYear()
    const from = new Date(currentYear,0,1)
    const to = new Date(currentYear,11,31)
    const date = "monthly"
    const orders = await orderModel.find({ status:"Placed",date:{$gte: from, $lte: to }})
  res.render('admin/salesreport',{ orders, from,to,date })
},
salesReportDaily:async(req,res)=>{
  var start = new Date();
  const from = start.setHours(0,0,0,0);
  var to = new Date();
  const pm = to.setHours(23,59,59,999);
  const date = "daily"
  const orders = await orderModel.find({ status:"Placed",date:{$gte: from, $lte: to }})
res.render('admin/salesreport',{ orders, from,to,date })
},
toaddcoupon:async(req,res)=>{
  res.render('admin/addcoupon',{ msg:"" })
}, 
salesReportWeekly:async(req,res)=>{
  const day = new Date();
  const start = day.getDate() - day.getDay();
  const end = start + 6;

  const from = new Date(day.setDate(start))
  const to = new Date(day.setDate(end))
  console.log(from,to)
  const date = "weekly"
  const orders = await orderModel.find({ status:"Placed",date:{$gte: from, $lte: to }})
res.render('admin/salesreport',{ orders, from,to,date })
},
addcoupon:async(req,res)=>{
    const data = req.body;
    const code =data.code;
    const codel = code.toUpperCase()
    const codeExist = await couponModel.findOne({ CODE:codel})
    const percentage =data.percentage;
    const limit = data.limit;
    const expire =data.expire; 
    if(codeExist){ 

      res.render('admin/addcoupon',{ msg:"coupon already exist" })
      
    }else{
      await couponModel.create({
        CODE:codel,
        PERCENTAGE:percentage, 
        LIMIT:limit,
        EXPIRE:new Date(expire)
      })
      
    }
    res.redirect('/admin/coupons')
},
toeditcoupon:async(req,res)=>{
  const id = req.params.id
  const couponid = mongoose.Types.ObjectId(id)
  const coupons = await couponModel.findOne({ _id:couponid })
  res.render('admin/editcoupon',{ coupons })
},
editcoupon:async(req,res)=>{
    const data = req.body;
    const code =data.CODE;
    const price =data.PRICE;
    const expire =data.EXPIRE;
    const id = req.params.id;
    const couponid = mongoose.Types.ObjectId(id)
    const coupons = await couponModel.findOneAndUpdate(
    { _id:couponid, },{$set:{
      CODE:code,
      PRICE:price,
      EXPIRE:new Date(expire)
    }}
  )
  res.redirect('/admin/coupons')
},
editcategory:async(req,res)=>{
  const catid = req.params.id;
  const id = mongoose.Types.ObjectId(catid)
  const cat = await categoryModel.findOne({ _id: id})
  console.log(cat)
  res.render('admin/editcat',{msg:"", cat})
},
editcat:async(req,res)=>{
  const id = req.params.id;
  const catid = mongoose.Types.ObjectId(id)
  const data =req.body;
  const namec = data.name
  const cat = await categoryModel.findOneAndUpdate({ _id:catid },{ $set:{ name:namec }})

  if(req.files!=null){
    console.log('jesl')
    const editImage = req.files.image;
    const editImageName = cat._id; 
    editImage.mv( 
      path.join(__dirname, "../public/CategoryImg/") + editImageName + ".jpg"
    );
  }       
  res.redirect('/admin/category_details')
},   
deletecat:async(req,res)=>{
  const id = req.params.id;
  const objId = mongoose.Types.ObjectId(id)
  const addcat = await categoryModel.findOneAndUpdate({ _id: objId },{$set:{ blockStatus:true }});
  const catname = addcat.name;
  const catpro = await productModel.updateMany({ category:catname },{$set:{ blockStatus:true } })
  console.log(catpro)
  res.redirect('/admin/category_details')
},
restorecat:async(req,res)=>{
  const id = req.params.id;
  const objId = mongoose.Types.ObjectId(id)
  const restocat = await categoryModel.findOneAndUpdate({_id:objId},{$set:{ blockStatus:false }})
  const catname = restocat.name;
  const catpro = await productModel.updateMany({ category:catname },{$set:{ blockStatus:false}})
  res.redirect('/admin/category_details')

},
downloadExcel:async(req,res)=>{
  const date = req.body;
  console.log(date.from)
  let from;
  let to;
  if(date.from=="daily"){
    const str = new Date();
     from = str.setHours(0,0,0,0);
     to = new Date();
  }else if(date.from=="weekly"){
    const day = new Date();
    const start = day.getDate() - day.getDay();
    const end = start + 6;

     from = new Date(day.setDate(start))
     to = new Date(day.setDate(end))
  }else if(date.from=="monthly"){
    const currentYear = new Date().getFullYear()
     from = new Date(currentYear,0,1)
     to = new Date(currentYear,11,31)
  }
  console.log(from, to)
  let orderData = await orderModel.find({status: "Placed",date:{ $gte: from, $lte: to }});

  const workbook = new excelJs.Workbook();
  const worksheet = workbook.addWorksheet("My Sheet");
  
  worksheet.columns = [
    { header: "No", key: "No", width: 30 },
    { header: "Id", key: "Id", width: 15 },
    { header: "Payment method", key: "Payment method", width: 15 },
    { header: "Status", key: "Status", width: 15 },
    { header: "Total amount", key: "Total amount", width: 15 },
    { header: "Date", key: "Date", width: 15 },
  ];
   let count=1;
  orderData.forEach((orderData) => {
    worksheet.addRow({
      No: count,
      Id: orderData._id,
      Paymentmethod: orderData.paymentMethod,
      Status: orderData.orderstatus,
      Totalamount: orderData.total,
      Date: orderData.date.toDateString(),
    });
    count++; 
  });

  await workbook.xlsx.writeFile("order.xlsx").then((data) => {
    const location = path.join(__dirname + "../../order.xlsx");
    res.download(location);
  });

},
  deleteProduct: async (req, res) => {
    await productModel.findOneAndUpdate({ _id: req.params.id },{$set:{ blockStatus:true}}).then(() => {
      res.redirect("/admin/products_details");
    });
  },
};
