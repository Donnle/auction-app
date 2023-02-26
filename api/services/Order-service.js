const TokensService = require('./Tokens-service');
const ProductModel = require('../models/Product-model');
const UserModel = require('../models/User-model');
const OrderModel = require('../models/Order-model');
const OrderDto = require('../dtos/Order-dto');

class OrderService {
  async buy(accessToken, productId, deliveryAddress) {
    const buyerUserDataFromToken = TokensService.validateAccessToken(accessToken);

    const productData = await ProductModel.findById(productId);
    const buyerUserData = await UserModel.findById(buyerUserDataFromToken.id);

    if (buyerUserData.balance < productData['buyNowPrice']) {
      throw new Error('Недостаньо коштів на балансі');
    }

    const sellerUserData = await UserModel.findById(productData['sellerId']);

    if (productData['currentBetUser']) {
      const currentBetUser = await UserModel.findByIdAndUpdate(productData['currentBetUser']);
      currentBetUser.balance += productData['currentBet'];
      await currentBetUser.save();
    }
    buyerUserData.balance -= productData['buyNowPrice'];
    await buyerUserData.save();

    const order = new OrderModel({
      buyerId: buyerUserData['_id'],
      sellerId: sellerUserData['_id'],
      productId: productData['_id'],
      deliveryAddress: deliveryAddress,
    });

    productData.isSold = true;

    await productData.save();
    await order.save();

    return {
      order: new OrderDto(order),
    };
  }
}

module.exports = new OrderService();
