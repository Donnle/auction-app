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
});

module.exports = model('product', Product);
