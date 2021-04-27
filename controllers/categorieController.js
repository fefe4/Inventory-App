var Categorie = require('../models/categorie');
var Product = require('../models/product');
var async = require('async')
const { body,validationResult } = require("express-validator");

// Display list of all Gategorie.
exports.categorie_list = function(req, res) {
    Categorie.find()
      .sort([['family_name', 'ascending']])
      .exec(function (err, list_categories) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('categorie_list', { title: 'no needed', categorie_list: list_categories });
      }); 
};

// Display detail page for a specific Gategorie.
exports.categorie_detail = function(req, res, next) {
    async.parallel({
        categorie: function(callback) {
            Categorie.findById(req.params.id)
              .exec(callback);
        },

        categorie_products: function(callback) {
            Product.find({ 'categorie': req.params.id })
              .exec(callback);
        },

    }, function(err, results) {
        if (err) { return next(err); }
        if (results.categorie==null) { // No results.
            var err = new Error('categorie not found');
            err.status = 404;
            return next(err);
        }
        // Successful, so render
        res.render('categorie_detail', { title: 'categorie Detail', categorie: results.categorie, categorie_products: results.categorie_products } );
    });

};

// Display categorie create form on GET.
exports.categorie_create_get = function(req, res) {
    res.render('categorie_form', { title: 'Create categorie' });
  };

// Display Gategorie create form on GET.
exports.categorie_create_post =  [

    // Validate and santize the name field.
    body('name', 'Categorie name required').trim().isLength({ min: 1 }).escape(),
  
    // Process request after validation and sanitization.
    (req, res, next) => {
  
      // Extract the validation errors from a request.
      const errors = validationResult(req);
  
      // Create a categorie object with escaped and trimmed data.
      var categorie = new Categorie(
        { name: req.body.name }
      );
  
      if (!errors.isEmpty()) {
        // There are errors. Render the form again with sanitized values/error messages.
        res.render('categorie_form', { title: 'Create Categorie', categorie: categorie, errors: errors.array()});
        return;
      }
      else {
        // Data from form is valid.
        // Check if Categorie with same name already exists.
        Categorie.findOne({ 'name': req.body.name })
          .exec( function(err, found_categorie) {
             if (err) { return next(err); }
  
             if (found_categorie) {
               // Categorie exists, redirect to its detail page.
               res.redirect(found_categorie.url);
             }
             else {
  
               categorie.save(function (err) {
                 if (err) { return next(err); }
                 // Categorie saved. Redirect to categorie detail page.
                 res.redirect(categorie.url);
               });
             } 
           });
      }
    }
  ];



// Display Gategorie delete form on GET.
exports.categorie_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Gategorie delete GET');
};

// Handle Gategorie delete on POST.
exports.categorie_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Gategorie delete POST');
};

// Display Gategorie update form on GET.
exports.categorie_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Gategorie update GET');
};

// Handle Gategorie update on POST.
exports.categorie_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Gategorie update POST');
};