const path = require("path");
const mongoose =require('mongoose')
const UserModel = require("../models/userSchema");
const productModel = require("../models/productSchema");
const categoryModel = require("../models/categorySchema");
const bannerModel = require('../models/bannerSchema')
const orderModel = require('../models/orderSchema')

// username & password of admin
const adminUserName = "adminX";
const adminPassword = "adminx@123";
//

module.exports = {
  toAdminHome: (req, res) => {
    if (req.session.admin) {
      res.redirect("/admin/dashboard");
    } else if (req.session.loggedIn) {
      res.redirect("/admin/dashboard");
    } else {
      res.render("admin/signin", { msg: "" });
    }
  },
  toAdminDash: (req, res) => {
    res.render("admin/dashboard", { admin: true });
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
    if (
      req.body.username === adminUserName &&
      req.body.password === adminPassword
    ) {
      req.session.admin = req.body.email;
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
  viewAddProduct: (req, res) => {
    res.render("admin/addproducts");
  },

  goToEditProduct: (req, res) => {
    productModel.find({ _id: req.params.id }).then((info) => {
      res.render("admin/editproduct", { info });
    });
  },
  editProduct: async (req, res) => {
    try {
       await productModel.replaceOne(
        { _id: req.params.id },
        { name: req.body.name, price: req.body.price, stock: req.body.stock }
      );

      const editImage = req.files.image;
      const editImageName = req.params.id;

      editImage.mv(
        path.join(__dirname, "../public/ProductImg/") + editImageName + ".jpg"
      );
      res.redirect("/admin/products_details");
    } catch {
      res.render("admin/404");
    }
  },
  
  toCategory: async (req, res) => {
    const cats = await categoryModel.find({});

    res.render("admin/category", { cats });
  },
  addCategory: (req, res) => {
    res.render("admin/addCategory");
  },
  addCategoryTOdb: async (req, res) => {
    const addcat = await categoryModel.create({ name: req.body.name });
    const image = req.files.Image;
    const imageName = addcat._id;
    image.mv(
      path.join(__dirname, "../public/CategoryImg/") + imageName + ".jpg"
    );
    res.redirect("/admin/category_details");
  },
  AddProduct: async (req, res) => {
    const addPro = await productModel.create({
      name: req.body.name,
      price: req.body.price,
      stock: req.body.stock,
    });
    const proImage = req.files.image;
    const proImageName = addPro._id;
    proImage.mv(
      path.join(__dirname, "../public/ProductImg/") + proImageName + ".jpg"
    );
    res.redirect("/admin/products_details");
  },
  oreders:async(req, res)=>{

    const orders = await orderModel.find({ status:"Placed" })

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
  res.render('admin/orderedpro',{ products })
  
},
  deleteProduct: async (req, res) => {
    await productModel.findOneAndUpdate({ _id: req.params.id },{$set:{ blockStatus:true}}).then(() => {
      res.redirect("/admin/products_details");
    });
  },
};
