var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductInstanceSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, //reference to the associated Product
    stock: {type: Number, required: true},
    status: {type: String, required: true, enum: ['Available', 'Out of Stock'], default: 'Maintenance'},
  }
);

// Virtual for Productinstance's URL
ProductInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/productinstance/' + this._id;
});

//Export model
module.exports = mongoose.model('ProductInstance', ProductInstanceSchema);