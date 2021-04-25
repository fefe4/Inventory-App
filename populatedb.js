#! /usr/bin/env node

console.log('This script populates some products and categories to the database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
console.log(process.argv)
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Product = require('./models/product')
var Categorie = require('./models/categorie')
var ProductInstance = require('./models/productInstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var products = []
var categoriess = []
var productinstances = []


function categorieCreate(name, cb) {
  var categorie = new Categorie({ name: name });
       
  categorie.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Categorie: ' + categorie);
    categoriess.push(categorie)
    cb(null, categorie);
  }   );
}

function productCreate(name, description, code, categorie, price, cb) {
  productdetail = { 
    name: name,
    description: description,
    price:price,
    code: code
  }
  if (categorie != false) productdetail.categorie = categorie
    
  var product = new Product (productdetail);    
  product.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New product: ' + product);
    products.push(product)
    cb(null, product)
  }  );
}


function productInstanceCreate(product, stock, cb) {
  productinstancedetail = { 
    product: product,
    stock:stock, 
  }    
  if (stock > 0) productinstancedetail.status = "Available"
  if (stock <= 0) productinstancedetail.status = "Out of Stock" 

  var productinstance = new ProductInstance(productinstancedetail);    
  productinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING productInstance: ' + productinstance);
      cb(err, null)
      return
    }
    console.log('New productInstance: ' + productinstance);
    productinstances.push(productinstance)
    cb(null, product)
  }  );
}


function createCategories(cb) {
    async.series([
        function(callback) {
          categorieCreate("Fruits", callback);
        },
        function(callback) {
          categorieCreate("Vegetables", callback);
        },
        function(callback) {
          categorieCreate("Meats", callback);
        }
        ],
        // optional callback
        cb);
}


function createproducts(cb) {
    async.parallel([
        function(callback) {
          productCreate('Tomato', 'Organic tomatoes directly from small entrepreneurs', '3081473211896', [categoriess[1],], 10, callback);
        },
        function(callback) {
          productCreate("Carrot", 'Comercial Carrots', '3388401352836',  [categoriess[1],], 5, callback);
        },
        function(callback) {
          productCreate("Red Apple", 'Imported Red apples directly from Canada', '3380756411336', [categoriess[0],], 12, callback);
        },
        function(callback) {
          productCreate("Flank Steak", "No description", '330765379528', [categoriess[2],], 25, callback);
        },
        function(callback) {
          productCreate("Skirt Steak", "No description", '3380765379504', [categoriess[2],], 28, callback);
        },
        function(callback) {
          productCreate('Orange', 'Best oranges from the south', '33821456874596',  [categoriess[0],], 7, callback);
        },
        function(callback) {
          productCreate('Potato', 'Potatoes grown with the F.e.F. system', '33440988833229', [categoriess[1],], 3 , callback)
        }
        ],
        // optional callback
        cb);
}


function createproductInstances(cb) {
    async.parallel([
        function(callback) {
          productInstanceCreate(products[0], 100, callback)
        },
        function(callback) {
          productInstanceCreate(products[1], 50, callback)
        },
        function(callback) {
          productInstanceCreate(products[2], 30, callback)
        },
        function(callback) {
          productInstanceCreate(products[3], 20, callback)
        },
        function(callback) {
          productInstanceCreate(products[4], 60, callback)
        },
        function(callback) {
          productInstanceCreate(products[5], 80, callback)
        },
        function(callback) {
          productInstanceCreate(products[6], 90, callback)
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createCategories,
    createproducts,
    createproductInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('productInstances: '+productinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



