const ProductModel = require('../models/Product-model');
const ProductDto = require('../dtos/Product-dto');

class MarketService {
  async getProducts(page, count, query = '') {
    const countSkipProducts = (page - 1) * count;

    let products;
    let countProducts;

    if (query) {
      products = await ProductModel.find({
        $or: [
          { title: { '$regex': query } },
          { description: { '$regex': query } },
        ],
      }).skip(countSkipProducts).limit(count);
      countProducts = await ProductModel.count();
    } else {
      const allProducts = await ProductModel.find();

      products = allProducts.slice(countSkipProducts, page * count);
      countProducts = allProducts.length;
    }
    let countPages = Math.ceil(countProducts / count);

    return {
      products: products.map((product) => new ProductDto(product)),
      pagination: {
        countPages,
        countProducts,
        currentPage: page,
      },
    };
  }

  async getProduct(productId) {
    const product = await ProductModel.findById(productId);

    return {
      product: new ProductDto(product),
    };
  }
}

module.exports = new MarketService();
