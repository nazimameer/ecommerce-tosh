const express = require("express");

const router = express.Router();
const dbconnect = require("../models/dataBaseConnect");

const signup = require("../models/userSchema");

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
router.get("/cart", userControllers.viewCart);
router.post('/change_pro_q', userControllers.changeProQuantity,subtotal) 
router.get('/cart/checkout',userControllers.toCheckOut)
router.post('/addsecondary',userControllers.addAddresstodb)
router.get('/addsecondary',userControllers.addAddress)
router.get('/productinfo/:id',userControllers.productzoom);
router.post('/addToCart',userControllers.addToCart);
router.get('/cart/delete_item/:id',userControllers.deleteInCart)
router.post('/deletePro',userControllers.deleteInCart)
router.get('/profile',userControllers.toProfilePage)
router.post('/addprimary',userControllers.AddPrimary)
router.get('/editprimary',userControllers.editprimary)
router.post('/editprimary',userControllers.editprimaryadd)
router.post('/editsecondary',userControllers.editSecondaryAdd)
router.post('/placeorder',userControllers.placeOrder)
router.get('/addprimary',userControllers.AddPrimarypage)
router.get('/editSecondary',userControllers.editSecondary)
router.get('/myorders',userControllers.toMyorders)
router.post('/cancelOrder',userControllers.cancelOrder)
router.post('/varify-payment',userControllers.varifyPayment)
router.get('/orderedpro/:id',userControllers.orderedPro)
router.get("/user/Log_out", userControllers.doUserLogout);

module.exports = router; 
   