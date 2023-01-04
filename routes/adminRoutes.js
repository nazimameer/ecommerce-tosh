const express = require("express");

const router = express.Router();
const session = require('../middleware/sessionmiddleware')

const adminControllers = require("../controllers/adminControllers");



router.get("/",session.verifyLoginAdmin,adminControllers.toAdminHome);
router.post("/signin", adminControllers.toAdminSignin);
router.get("/dashboard",session.verifyLoginAdmin,adminControllers.toAdminDash); 
router.get("/user_details",session.verifyLoginAdmin, adminControllers.listUsers);
router.get("/users/block/:id",session.verifyLoginAdmin, adminControllers.blockUser);
router.get("/users/unblock/:id",session.verifyLoginAdmin, adminControllers.unblockUser); 
router.get("/products_details",session.verifyLoginAdmin, adminControllers.listProducts);
router.get("/products_details/edit/:id",session.verifyLoginAdmin, adminControllers.goToEditProduct);
router.post("/products_details/edit/:id",session.verifyLoginAdmin, adminControllers.editProduct); 
router.get("/products_details/delete/:id",session.verifyLoginAdmin, adminControllers.deleteProduct);
router.get('/products_details/restore/:id',session.verifyLoginAdmin,adminControllers.restorepro)
router.get("/banner/edit/:id",session.verifyLoginAdmin, adminControllers.goToEditBanner);
router.post("/banner/edit/:id",session.verifyLoginAdmin, adminControllers.EditBanner);
router.get('/banner/delete/:id',session.verifyLoginAdmin,adminControllers.deleteBanner)
router.get('/banner/restore/:id',session.verifyLoginAdmin,adminControllers.restorebanner)
router.get("/add_product",session.verifyLoginAdmin, adminControllers.viewAddProduct);
router.post("/products/add_product",session.verifyLoginAdmin, adminControllers.AddProduct);
router.post('/banner/add_banner',session.verifyLoginAdmin,adminControllers.addBannerTodb)
router.get("/users",session.verifyLoginAdmin,session.verifyLoginAdmin, adminControllers.toUsers);
router.get('/Banners',session.verifyLoginAdmin,adminControllers.toBanners)
router.get('/coupons',session.verifyLoginAdmin,adminControllers.tocoupons)
router.get('/add_banner',session.verifyLoginAdmin,adminControllers.toAddBanner)
router.get("/category_details",session.verifyLoginAdmin, adminControllers.toCategory);
router.get("/category/add_category",session.verifyLoginAdmin, adminControllers.addCategory);
router.post("/category/add_category",session.verifyLoginAdmin, adminControllers.addCategoryTOdb);
router.post('/coupons/add_coupon',session.verifyLoginAdmin,adminControllers.addcoupon)
router.post('/coupons/edit_coupon/:id',session.verifyLoginAdmin,adminControllers.editcoupon)
router.get('/orders',session.verifyLoginAdmin,adminControllers.orders)
router.post('/confirmstatus',session.verifyLoginAdmin,adminControllers.confirmstatus)
router.post('/shippedstatus',session.verifyLoginAdmin,adminControllers.shippedstatus)
router.post('/deliveredstatus',session.verifyLoginAdmin,adminControllers.deliveredstatus)
router.get('/orderedpro/:id',session.verifyLoginAdmin,adminControllers.orderedpro)
router.get('/salesreport/yearly',session.verifyLoginAdmin,adminControllers.salesreport) 
router.get('/salesreport/weekly',session.verifyLoginAdmin,adminControllers.salesReportWeekly)
router.get('/salesreport/daily',session.verifyLoginAdmin,adminControllers.salesReportDaily)
router.get('/addcoupon',session.verifyLoginAdmin,adminControllers.toaddcoupon)
router.get('/editcoupon/:id',session.verifyLoginAdmin,adminControllers.toeditcoupon)
router.post("/downloadExcel",session.verifyLoginAdmin,adminControllers.downloadExcel)
router.get('/editcat/:id',session.verifyLoginAdmin,adminControllers.editcategory);
router.get('/deletecat/:id',session.verifyLoginAdmin,adminControllers.deletecat)
router.get('/restorecat/:id',session.verifyLoginAdmin,adminControllers.restorecat)
router.post('/category/edit/:id',session.verifyLoginAdmin,adminControllers.editcat)
router.get("/Log_out", adminControllers.doAdminLogout);

module.exports = router;
