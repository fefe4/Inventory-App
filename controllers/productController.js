var Product = require('../models/product');
var Categorie = require('../models/categorie');
var async = require('async');

exports.catalog = function(req, res, next) {
  Product.find({}, 'name categorie')
  .populate('categorie')
      .exec(function (err, list_products) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('catalog', { title: 'product List', product_list: list_products });
    });
};

// // Display list of all products.
// exports.product_list = function(req, res) {
//     res.send('NOT IMPLEMENTED: product list');
// };

// // Display detail page for a specific product.
// exports.product_detail = function(req, res) {
//     res.send('NOT IMPLEMENTED: product detail: ' + req.params.id);
// };

// // Display product create form on GET.
// exports.product_create_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: product create GET');
// };

// // Handle product create on POST.
// exports.product_create_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: product create POST');
// };

// // Display product delete form on GET.
// exports.product_delete_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: product delete GET');
// };

// // Handle product delete on POST.
// exports.product_delete_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: product delete POST');
// };

// // Display product update form on GET.
// exports.product_update_get = function(req, res) {
//     res.send('NOT IMPLEMENTED: product update GET');
// };

// // Handle product update on POST.
// exports.product_update_post = function(req, res) {
//     res.send('NOT IMPLEMENTED: product update POST');
// };