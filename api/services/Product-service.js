const TokensService = require('./Tokens-service');
const ProductModel = require('../models/Product-model');
const UserModel = require('../models/User-model');
const UserDto = require('../dtos/User-dto');
const ProductDto = require('../dtos/Product-dto');

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

    console.log(`Користувач з id: ${userData._id}, піднняв ставку на товар з id: ${productId}, до ${raisedBet}`);

    return {
      product: new ProductDto(product),
      userData: new UserDto(userData),
    };
  }
}

module.exports = new ProductService();
