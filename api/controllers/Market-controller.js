const MarketService = require('../services/Market-service');

class MarketController {
  async getProducts(req, res, next) {
    try {
      const { page, count, query } = req.body;
      const products = await MarketService.getProducts(+page, +count, query);

      return res.status(200).send({ data: products, success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ data: { message: e.message }, success: false });
    }
  }

  async getProduct(req, res, next) {
    try {
      const { productId } = req.body;
      const product = await MarketService.getProduct(productId);

      return res.status(200).send({ data: product, success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ data: { message: e.message }, success: false });
    }
  }
}

module.exports = new MarketController();
