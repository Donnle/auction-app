const { Schema, model } = require('mongoose');

const Product = new Schema({
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
  photos: {
    required: true,
    type: Array,
  },
  currentBetUser: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: undefined,
  },
});

module.exports = model('product', Product);
