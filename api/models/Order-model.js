const { Schema, model } = require('mongoose');

const order = new Schema({
  buyerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
  deliveryAddress: {
    type: String,
    require: true,
  },
});

module.exports = model('order', order);
