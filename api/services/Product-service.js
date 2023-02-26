const TokensService = require('./Tokens-service');
const ProductModel = require('../models/Product-model');
const UserModel = require('../models/User-model');
const OrderModel = require('../models/Order-model');
const ProductDto = require('../dtos/Product-dto');
const OrderDto = require('../dtos/Order-dto');
const UserDto = require('../dtos/User-dto');

class ProductService {
  async raiseBet(productId, raisedBet, accessToken) {
    const userDataFromAccessToken = TokensService.validateAccessToken(accessToken);
    const userData = await UserModel.findById(userDataFromAccessToken.id);

    console.log(userData);

    if (userData.balance < raisedBet) {
      throw new Error('Недастатньо коштів');
    }

    const product = await ProductModel.findById(productId);
    const previousCurrentBetUser = await UserModel.findById(product.currentBetUser);

    if (product.isSold) {
      throw new Error('Товар продано!');
    }

    if (!product.currentBetUser) {
      console.log('Це перша ставка!');
      userData.balance -= raisedBet;
    } else if (product.currentBetUser.equals(userData._id)) {
      console.log('Користувач підвищив свою ж ставку!');
      userData.balance -= raisedBet - product.currentBet;
    } else {
      console.log('Користувач перебив ставку іншого користувача!');
      previousCurrentBetUser.balance += product.currentBet;
      await previousCurrentBetUser.save();

      userData.balance -= raisedBet;
    }

    await userData.save();
    product.currentBet = raisedBet;
    product.currentBetUser = userData._id;
    await product.save();

    console.log(`Користувач з id: ${userData._id}, піднняв ставку на товар з id: ${productId}, до ${raisedBet}`);

    return {
      product: new ProductDto(product),
      userData: new UserDto(userData),
    };
  }

  async buyProduct(accessToken, productId, deliveryAddress) {
    const buyerUserDataFromToken = TokensService.validateAccessToken(accessToken);

    const productData = await ProductModel.findById(productId);
    if (productData.isSold) {
      throw new Error('Товар продано!');
    }

    const buyerUserData = await UserModel.findById(buyerUserDataFromToken.id);
    if (buyerUserData.balance < productData['buyNowPrice']) {
      throw new Error('Недостаньо коштів на балансі');
    }

    if (productData['currentBetUser']) {
      const currentBetUser = await UserModel.findByIdAndUpdate(productData['currentBetUser']);
      currentBetUser.balance += productData['currentBet'];
      await currentBetUser.save();
    }

    buyerUserData.balance -= productData['buyNowPrice'];
    await buyerUserData.save();

    const order = new OrderModel({
      buyerId: buyerUserData['_id'],
      sellerId: productData['sellerId'],
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

module.exports = new ProductService();
