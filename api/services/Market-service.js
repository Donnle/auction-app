const Product = require('../models/Product-model');

class MarketService {
  async getProducts(page, count, query = '') {
    const countSkipProducts = (page - 1) * count;

    let products;
    let countProducts;
    let countPages;

    if (query) {
      products = await Product.find({
        $or: [
          { title: { '$regex': query } },
          { description: { '$regex': query } },
        ],
      }).skip(countSkipProducts).limit(count);
      countProducts = await Product.count();
      countPages = Math.ceil(countProducts / count);
    } else {
      const allProducts = await Product.find();

      products = allProducts.slice(countSkipProducts, page * count);
      countProducts = allProducts.length;
      countPages = Math.ceil(countProducts / count);
    }

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

  async raiseCurrentBet(productId, raisedBet, userId) {
    return {
      success: true,
      data: {
        product: await Product.findByIdAndUpdate(productId, {
          currentBet: raisedBet,
          currentBetUser: userId,
        }, { new: true }),
      },
    };
  }
}

module.exports = new MarketService();
