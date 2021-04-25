var express = require('express');
var router = express.Router();
var product_controller = require('../controllers/productController')
// Require controller modules.
// var product_controller = require('../controllers/productController');

/// product ROUTES ///

// GET catalog home page.
router.get('/', product_controller.catalog)


module.exports = router;