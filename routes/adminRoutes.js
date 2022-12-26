const express = require("express");

const router = express.Router();
const sessionmiddleware = require('../middleware/sessionmiddleware')

const adminControllers = require("../controllers/adminControllers");

router.get("/", adminControllers.toAdminHome);
router.post("/signin", adminControllers.toAdminSignin);
router.get("/dashboard",sessionmiddleware.verifyLoginAdmin,adminControllers.toAdminDash); 
router.get("/user_details",sessionmiddleware.verifyLoginAdmin, adminControllers.listUsers);
router.get("/users/block/:id",sessionmiddleware.verifyLoginAdmin, adminControllers.blockUser);
router.get("/users/unblock/:id",sessionmiddleware.verifyLoginAdmin, adminControllers.unblockUser); 
router.get("/products_details", adminControllers.listProducts);
router.get("/products_details/edit/:id",sessionmiddleware.verifyLoginAdmin, adminControllers.goToEditProduct);
router.post("/products_details/edit/:id",sessionmiddleware.verifyLoginAdmin, adminControllers.editProduct); 
router.get("/products_details/delete/:id",sessionmiddleware.verifyLoginAdmin, adminControllers.deleteProduct);
router.get('/products_details/restore/:id',sessionmiddleware.verifyLoginAdmin,adminControllers.restorepro)
router.get("/banner/edit/:id",sessionmiddleware.verifyLoginAdmin, adminControllers.goToEditBanner);
router.post("/banner/edit/:id",sessionmiddleware.verifyLoginAdmin, adminControllers.EditBanner);
router.get('/banner/delete/:id',sessionmiddleware.verifyLoginAdmin,adminControllers.deleteBanner)
router.get('/banner/restore/:id',sessionmiddleware.verifyLoginAdmin,adminControllers.restorebanner)
router.get("/add_product",sessionmiddleware.verifyLoginAdmin, adminControllers.viewAddProduct);
router.post("/products/add_product",sessionmiddleware.verifyLoginAdmin, adminControllers.AddProduct);
router.post('/banner/add_banner',sessionmiddleware.verifyLoginAdmin,adminControllers.addBannerTodb)
router.get("/users",sessionmiddleware.verifyLoginAdmin, adminControllers.toUsers);
router.get('/Banners',sessionmiddleware.verifyLoginAdmin,adminControllers.toBanners)
router.get('/coupons',sessionmiddleware.verifyLoginAdmin,adminControllers.tocoupons)
router.get('/add_banner',sessionmiddleware.verifyLoginAdmin,adminControllers.toAddBanner)
router.get("/category_details",sessionmiddleware.verifyLoginAdmin, adminControllers.toCategory);
router.get("/category/add_category",sessionmiddleware.verifyLoginAdmin, adminControllers.addCategory);
router.post("/category/add_category",sessionmiddleware.verifyLoginAdmin, adminControllers.addCategoryTOdb);
router.post('/coupons/add_coupon',sessionmiddleware.verifyLoginAdmin,adminControllers.addcoupon)
router.post('/coupons/edit_coupon/:id',sessionmiddleware.verifyLoginAdmin,adminControllers.editcoupon)
router.get('/orders',sessionmiddleware.verifyLoginAdmin,adminControllers.orders)
router.post('/confirmstatus',sessionmiddleware.verifyLoginAdmin,adminControllers.confirmstatus)
router.post('/shippedstatus',sessionmiddleware.verifyLoginAdmin,adminControllers.shippedstatus)
router.post('/deliveredstatus',sessionmiddleware.verifyLoginAdmin,adminControllers.deliveredstatus)
router.get('/orderedpro/:id',sessionmiddleware.verifyLoginAdmin,adminControllers.orderedpro)
router.get('/salesreport/yearly',sessionmiddleware.verifyLoginAdmin,adminControllers.salesreport) 
router.get('/salesreport/weekly',sessionmiddleware.verifyLoginAdmin,adminControllers.salesReportWeekly)
router.get('/salesreport/daily',sessionmiddleware.verifyLoginAdmin,adminControllers.salesReportDaily)
router.get('/addcoupon',sessionmiddleware.verifyLoginAdmin,adminControllers.toaddcoupon)
router.get('/editcoupon/:id',sessionmiddleware.verifyLoginAdmin,adminControllers.toeditcoupon)

router.get("/Log_out", adminControllers.doAdminLogout);

module.exports = router;
