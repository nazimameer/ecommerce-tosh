const express = require("express");

const router = express.Router();
const dbconnect = require("../models/dataBaseConnect");

const signup = require("../models/userSchema");
const sessionmiddleware = require('../middleware/sessionmiddleware')
const bodyParser = require("body-parser");

const userControllers = require("../controllers/userControllers");
const { subtotal } = require("../controllers/userControllers");

router.use(express());
router.use(bodyParser.urlencoded({ extended: false })); 
router.use(bodyParser.json());
// start
  
router.get("/", userControllers.goHome);
router.get("/sign_up", userControllers.goToSignup);
router.post("/sign_up", userControllers.sendToDatabase);
router.post('/otp',userControllers.otpPage)
router.get("/log_in", userControllers.goToLogin);
router.post("/log_in", userControllers.doLogin);
router.get("/product_info/:id", userControllers.getProductInfo);
router.get("/cart",sessionmiddleware.verifyLoginUser,userControllers.viewCart);
router.post('/change_pro_q',sessionmiddleware.verifyLoginUser,userControllers.changeProQuantity,subtotal) 
router.get('/cart/checkout',sessionmiddleware.verifyLoginUser,userControllers.toCheckOut)
router.post('/addsecondary',sessionmiddleware.verifyLoginUser,userControllers.addAddresstodb)
router.get('/addsecondary',sessionmiddleware.verifyLoginUser,userControllers.addAddress)
router.get('/productinfo/:id',sessionmiddleware.verifyLoginUser,userControllers.productzoom);
router.post('/addToCart',sessionmiddleware.verifyLoginUser,userControllers.addToCart);
router.get('/cart/delete_item/:id',sessionmiddleware.verifyLoginUser,userControllers.deleteInCart)
router.post('/deletePro',sessionmiddleware.verifyLoginUser,userControllers.deleteInCart)
router.get('/profile',sessionmiddleware.verifyLoginUser,userControllers.toProfilePage)
router.post('/addprimary',sessionmiddleware.verifyLoginUser,userControllers.AddPrimary)
router.get('/editprimary',sessionmiddleware.verifyLoginUser,userControllers.editprimary)
router.post('/editprimary',sessionmiddleware.verifyLoginUser,userControllers.editprimaryadd)
router.post('/editsecondary',sessionmiddleware.verifyLoginUser,userControllers.editSecondaryAdd)
router.post('/placeorder',sessionmiddleware.verifyLoginUser,userControllers.placeOrder) 
router.post('/applycoupon',sessionmiddleware.verifyLoginUser,userControllers.applycoupon)
router.get('/addprimary',sessionmiddleware.verifyLoginUser,userControllers.AddPrimarypage)
router.get('/editSecondary',sessionmiddleware.verifyLoginUser,userControllers.editSecondary)
router.get('/myorders',sessionmiddleware.verifyLoginUser,userControllers.toMyorders)
router.post('/cancelOrder',sessionmiddleware.verifyLoginUser,userControllers.cancelOrder)
router.post('/varify-payment',sessionmiddleware.verifyLoginUser,userControllers.varifyPayment)
router.get('/orderedpro/:id',sessionmiddleware.verifyLoginUser,userControllers.orderedPro)
router.post('/addtowishlist',userControllers.addtowishlist)
router.get('/wishlist',sessionmiddleware.verifyLoginUser,userControllers.towishlist)
router.post('/removewish',sessionmiddleware.verifyLoginUser,userControllers.removewish)
router.get("/user/Log_out",sessionmiddleware.verifyLoginUser, userControllers.doUserLogout);

module.exports = router; 
   