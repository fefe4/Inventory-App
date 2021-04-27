var Product = require('../models/product');
var Categorie = require('../models/categorie');
var async = require('async');
var ProductInstance = require ('../models/productInstance')
const { body,validationResult } = require("express-validator");

exports.catalog = function(req, res, next) {
    async.series([
      function(callback){
      Product.find({}, 'name categorie')
      .populate('categorie')   
      .exec(callback)
      },
      function(callback){
        Categorie.find()
        .exec(callback)
      }

    ], function (error, results){     
        res.render('catalog', { name: 'product List', product_list: results[0], categories: results[1] });
      })
};

// // Display list of all products.
// exports.product_list = function(req, res) {
//     res.send('NOT IMPLEMENTED: product list');
// };

// Display detail page for a specific product.
exports.product_detail = function(req, res) {
      async.parallel({
        product: function(callback) {

            Product.findById(req.params.id)
              .populate('categorie')
              .exec(callback);
        },
        product_instance: function(callback) {

          ProductInstance.find({ 'product': req.params.id })
          .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.product==null) { // No results.
            var err = new Error('product not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('product_detail', { name: results.product.name, product: results.product, product_instances: results.product_instance } );
    });};

// Display product create form on GET.
exports.product_create_get = function(req, res) {

  async.parallel({
      categories: function(callback) {
          Categorie.find(callback);
      },
  }, function(err, results) {
      if (err) { return next(err); }
      res.render('product_form', { name: 'Create Product',  categories: results.categories });
  });

};

exports.product_create_post = [
  // Convert the categorie to an array.
  (req, res, next) => {
      if(!(req.body.categorie instanceof Array)){
          if(typeof req.body.categorie ==='undefined')
          req.body.categorie = [];
          else
          req.body.categorie = new Array(req.body.categorie);
      }
      next();
  },

  // Validate and sanitise fields.
  body('name', 'name must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('description', 'description must not be empty.').trim().isLength({ min: 1 }).escape(),
  body('code', 'code must not be empty').trim().isLength({ min: 1 }).escape(),
  body('price', 'price must not be empty').trim().isLength({min: 1 }).escape(),
  body('categorie.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

      // Extract the validation errors from a request.
      const errors = validationResult(req);

      // Create a product object with escaped and trimmed data.
      var product = new Product(
        { name: req.body.name,
          description: req.body.description,
          code: req.body.code,
          price:req.body.price,
          categorie: req.body.categorie
         });

      if (!errors.isEmpty()) {
          // There are errors. Render form again with sanitized values/error messages.

          // Get all authors and categories for form.
          async.parallel({
             
              categories: function(callback) {
                  Categorie.find(callback);
              },
          }, function(err, results) {
              if (err) { return next(err); }

              // Mark our selected categories as checked.
              for (let i = 0; i < results.categories.length; i++) {
                  if (product.categorie.indexOf(results.categories[i]._id) > -1) {
                      results.categories[i].checked='true';
                  }
              }
              res.render('product_form', { title: 'Create product', categories:results.categories, product: product, errors: errors.array() });
          });
          return;
      }
      else {
          // Data from form is valid. Save product.
          product.save(function (err) {
              if (err) { return next(err); }
                 //successful - redirect to new product record.
                 res.redirect(product.url);
              });
      }
  }
];

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