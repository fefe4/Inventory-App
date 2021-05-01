var express = require("express");
var router = express.Router();
var multer  = require('multer')


var product_controller = require("../controllers/productController");
var categorie_controller = require("../controllers/categorieController");
// Require controller modules.
// var product_controller = require('../controllers/productController');

/// product ROUTES ///
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage })

// GET catalog home page.
router.get("/", product_controller.catalog);
//product controllers
router.get("/product/create", product_controller.product_create_get);
router.post("/product/create", upload.single('uploaded_file'), product_controller.product_create_post);
router.get("/product/:id", product_controller.product_detail);
router.get("/product/:id/update", product_controller.product_update_get);
router.post("/product/:id/update", upload.single('uploaded_file'), product_controller.product_update_post);
router.get("/product/:id/delete", product_controller.product_delete_get);
router.post("/product/:id/delete", product_controller.product_delete_post);
//categorie controllers
router.get("/categorie/create", categorie_controller.categorie_create_get);
router.post("/categorie/create", upload.single('uploaded_categorie'), categorie_controller.categorie_create_post);
router.get("/categorie/:id", categorie_controller.categorie_detail);
router.get("/categorie/:id/delete", categorie_controller.categorie_delete_get);
router.post("/categorie/:id/delete",categorie_controller.categorie_delete_post);
router.get("/categorie/:id/update", categorie_controller.categorie_update_get);
router.post("/categorie/:id/update", upload.single('uploaded_categorie'), categorie_controller.categorie_update_post);
router.get("/categorie", categorie_controller.categorie_list);
//admin
router.get("/admin", product_controller.admin );



module.exports = router;
