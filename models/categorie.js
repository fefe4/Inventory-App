var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CategorieSchema = new Schema ({
  name: {type:String, required:true, maxLength:100}
})

CategorieSchema
.virtual('url')
.get(function () {
  return '/catalog/categorie/' + this._id;
});

//Exports Model
module.exports = mongoose.model('Categorie', CategorieSchema);