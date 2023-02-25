const ProductService = require('../services/Product-service');

class ProductController {
  async raiseBet(req, res, next) {
    try {
      const { authorization } = req.headers;
      const { productId, raisedBet } = req.body;
      const accessToken = authorization.split(' ')[1];

      const responseData = await ProductService.raiseBet(productId, raisedBet, accessToken);
      return res.status(200).send(responseData);
    } catch (e) {
      console.log(e);
      return res.status(400).send({ data: { message: e.message }, success: false });
    }
  }
}

module.exports = new ProductController();
