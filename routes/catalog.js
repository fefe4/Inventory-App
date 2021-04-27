var express = require('express');
var router = express.Router();
var product_controller = require('../controllers/productController')
var categorie_controller = require('../controllers/categorieController')
// Require controller modules.
// var product_controller = require('../controllers/productController');

/// product ROUTES ///

// GET catalog home page. 
router.get('/', product_controller.catalog)
//product controllers
router.get('/product/create', product_controller.product_create_get)
router.post('/product/create', product_controller.product_create_post)
router.get('/product/:id', product_controller.product_detail)


//categorie controllers
router.get('/categorie/create', categorie_controller.categorie_create_get);
router.post('/categorie/create', categorie_controller.categorie_create_post);
router.get('/categorie/:id', categorie_controller.categorie_detail);
router.get('/categorie', categorie_controller.categorie_list);

module.exports = router;