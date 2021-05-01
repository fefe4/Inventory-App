var Product = require('../models/product');
var Categorie = require('../models/categorie');
var async = require('async');
var ProductInstance = require ('../models/productInstance');
var multer  = require('multer');
var upload = multer({ dest: '../public/images/uploads/' });

const { body,validationResult } = require("express-validator");

exports.catalog = function(req, res, next) {
    async.series([
      function(callback){
      Product.find()
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
exports.product_detail = function(req, res, next) {
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
        res.render('product_detail', { name: results.product.name, product: results.product, img_src:results.product.image , product_instances: results.product_instance } );
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
  body('password').escape(),    
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
          categorie: req.body.categorie,
          image: `uploads/${req.file.originalname}`
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
              res.render('product_form', { title: 'Create product', categories:results.categories, product: product, img_src:req.file.path, errors: errors.array() });
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

// Display product delete form on GET.
exports.product_delete_get = function(req, res) {
    async.parallel({
        product: function(callback) {
            Product.findById(req.params.id).exec(callback)
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.product==null) { // No results.
            res.redirect('/catalog/product');
        }
        // Successful, so render.
        res.render('product_delete', { title: 'Delete Product', product: results.product} );
    });
  
};

// Handle product delete on POST.
exports.product_delete_post =  [
    body('password', 'wrong password').isLength({min:1}).equals(":D").escape(),
  
    (req,res,next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            res.render('delete_form', { title: 'Delete Product', product:product, errors: errors.array() });
        } 
        else {
            async.parallel({
                product: function(callback) {
                Product.findById(req.body.productid).exec(callback)
                console.log(Product)
                },
            
            }, function(err, results) {
                if (err) { return next(err); }
                // Success
                else {
                    // Categorie has no Products. Delete it and redirect to the list of categories.
                    Product.findByIdAndRemove(req.body.productid, function deleteProduct(err) {
                        if (err) { return next(err); }
                        // Success - go to author list
                        res.redirect('/catalog')
                    })
                }
                
            })
        };
    }
]

exports.product_update_get = function(req, res, next) {

    // Get product and categories for form.
    async.parallel({
        product: function(callback) {
            Product.findById(req.params.id).populate('categorie').exec(callback);
        },
        categories: function(callback) {
            Categorie.find(callback);
        },
        }, function(err, results) {
            if (err) { return next(err); }
            if (results.product==null) { // No results.
                var err = new Error('Product not found');
                err.status = 404;
                return next(err);
            }
            // Success.

            // TODO: Mark our selected categories as checked.
            //(trying to implement a way so that current categories get marked)
            for (var all_g_iter = 0; all_g_iter < results.categories.length; all_g_iter++) {
                for (var product_g_iter = 0; product_g_iter < results.product.categorie.length; product_g_iter++) {
                    if (results.categories[all_g_iter]._id.toString()===results.product.categorie[product_g_iter]._id.toString()) {
                        results.categories[all_g_iter].checked='true';
                    }
                }
            }
            res.render('product_form', { title: 'Update Product', categories: results.categories, product: results.product });
        });
};


// Handle product update on POST.
exports.product_update_post = [

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
    body('password', 'wrong password').isLength({min:1}).equals(":D").escape(),
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
            categorie: (typeof req.body.categorie==='undefined') ? [] : req.body.categorie,
            _id:req.params.id, //This is required, or a new ID will be assigned!
            image: `uploads/${req.file.originalname}`
           });

        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/error messages.

            // Get all categories for form.
            async.parallel({
                categories: function(callback) {
                    Categorie.find(callback);
                },
            }, function(err, results) {
                if (err) { return next(err); }
                res.render('product_form', { title: 'Update Product', product:product, errors: errors.array() });
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            Product.findByIdAndUpdate(req.params.id, product, {}, function (err,theproduct) {
                if (err) { return next(err); }
                   // Successful - redirect to product detail page.
                   res.redirect(theproduct.url);
                });
        }
    }
];

exports.admin = function(req,res) {
    async.series([
        function(callback){
            Product.find()
            .populate('categorie')   
            .exec(callback)
        },
        function(callback){
            Categorie.find()
            .exec(callback)
        }
        
    ], function (error, results){     
        res.render('admin', { title: 'admin', product_list: results[0], categories: results[1] });
    })
};    
    
