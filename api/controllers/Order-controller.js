const OrderService = require('../services/Order-service');

class OrderController {
  async buy(req, res, next) {
    try {
      const { productId, deliveryAddress } = req.body;
      const { authorization } = req.headers;
      const accessToken = authorization.split(' ')[1];

      const data = await OrderService.buy(accessToken, productId, deliveryAddress);
      return res.status(200).send({ data, success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ data: { message: e.message }, success: false });
    }
  }
}

module.exports = new OrderController();
