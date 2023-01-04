const express = require("express");

const router = express.Router();

const adminControllers = require("../controllers/adminControllers");

router.get("/", adminControllers.toAdminHome);
router.post("/signin", adminControllers.toAdminSignin);
router.get("/dashboard", adminControllers.toAdminDash); 
router.get("/user_details", adminControllers.listUsers);
router.get("/users/block/:id", adminControllers.blockUser);
router.get("/users/unblock/:id", adminControllers.unblockUser); 
router.get("/products_details", adminControllers.listProducts);
router.get("/products_details/edit/:id", adminControllers.goToEditProduct);
router.post("/products_details/edit/:id", adminControllers.editProduct); 
router.get("/products_details/delete/:id", adminControllers.deleteProduct);
router.get('/products_details/restore/:id',adminControllers.restorepro)
router.get("/banner/edit/:id", adminControllers.goToEditBanner);
router.post("/banner/edit/:id", adminControllers.EditBanner);
router.get('/banner/delete/:id',adminControllers.deleteBanner)
router.get('/banner/restore/:id',adminControllers.restorebanner)
router.get("/add_product", adminControllers.viewAddProduct);
router.post("/products/add_product", adminControllers.AddProduct);
router.post('/banner/add_banner',adminControllers.addBannerTodb)
router.get("/users", adminControllers.toUsers);
router.get('/Banners',adminControllers.toBanners)
router.get('/coupons',adminControllers.tocoupons)
router.get('/add_banner',adminControllers.toAddBanner)
router.get("/category_details", adminControllers.toCategory);
router.get("/category/add_category", adminControllers.addCategory);
router.post("/category/add_category", adminControllers.addCategoryTOdb);
router.post('/coupons/add_coupon',adminControllers.addcoupon)
router.post('/coupons/edit_coupon/:id',adminControllers.editcoupon)
router.get('/orders',adminControllers.orders)
router.post('/confirmstatus',adminControllers.confirmstatus)
router.post('/shippedstatus',adminControllers.shippedstatus)
router.post('/deliveredstatus',adminControllers.deliveredstatus)
router.get('/orderedpro/:id',adminControllers.orderedpro)
router.get('/salesreport/yearly',adminControllers.salesreport) 
router.get('/salesreport/weekly',adminControllers.salesReportWeekly)
router.get('/salesreport/daily',adminControllers.salesReportDaily)
router.get('/addcoupon',adminControllers.toaddcoupon)
router.get('/editcoupon/:id',adminControllers.toeditcoupon)
router.post("/downloadExcel",adminControllers.downloadExcel)
router.get('/editcat/:id',adminControllers.editcategory);
router.get('/deletecat/:id',adminControllers.deletecat)
router.get('/restorecat/:id',adminControllers.restorecat)
router.post('/category/edit/:id',adminControllers.editcat)
router.get("/Log_out", adminControllers.doAdminLogout);

module.exports = router;
