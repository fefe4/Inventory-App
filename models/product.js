var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema(
  {
    name: {type: String, required: true},
    price: {type: Number, required:true},
    description: {type: String, required: true},
    code: {type: Number, required: true},
    categorie: [{type: Schema.Types.ObjectId, ref: 'Categorie'}]
  }
);

// Virtual for Product's URL
ProductSchema
.virtual('url')
.get(function () {
  return '/catalog/product/' + this._id;
});

//Export model
module.exports = mongoose.model('Product', ProductSchema);

//