const Product = require('../models/Product-model');

class MarketService {
  async getProducts(page, count, query) {
    const countSkipProducts = (page - 1) * count;
    const products = await Product.find({
      title: { '$regex': query || '' },
      description: { '$regex': query || '' },
    }).skip(countSkipProducts).limit(count);

    const countProducts = await Product.count();
    const countPages = Math.ceil(countProducts / count);

    return {
      products,
      pagination: {
        countPages,
        countProducts,
        currentPage: page,
      },
    };
  }

  async getProduct(productId) {
    const product = await Product.findById(productId);

    return {
      product,
    };
  }
}

module.exports = new MarketService();
