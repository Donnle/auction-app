const { Schema, model } = require('mongoose');

const ProductModel = new Schema({
  title: {
    required: true,
    type: String,
  },
  description: {
    required: true,
    type: String,
  },
  buyNowPrice: {
    required: true,
    type: Number,
  },
  currentBet: {
    required: true,
    type: Number,
  },
  minStep: {
    required: true,
    type: Number,
  },
  endDate: {
    required: true,
    type: Date,
  },
  photos: [{
    required: true,
    type: String,
  }],
  currentBetUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: undefined,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  isSold: {
    type: Boolean,
    default: false,
  },
});

module.exports = model('product', ProductModel);
