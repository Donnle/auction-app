const TokensService = require('./Tokens-service');
const ProductModel = require('../models/Product-model');
const UserModel = require('../models/User-model');
const UserDto = require('../dtos/User-dto');

class ProductService {
  async raiseBet(productId, raisedBet, accessToken) {
    const userDataFromAccessToken = TokensService.validateAccessToken(accessToken);
    const userData = await UserModel.findById(userDataFromAccessToken.id);

    if (userData.balance < raisedBet) {
      return {
        data: 'Недастатньо коштів',
        success: false,
      };
    }

    const product = await ProductModel.findById(productId);
    const previousCurrentBetUser = await UserModel.findById(product.currentBetUser);

    console.log(product.currentBetUser);
    console.log(userData._id);

    if (!product.currentBetUser) {
      console.log('product.currentBetUser: ', product.currentBetUser);
      userData.balance -= raisedBet;
    } else if (product.currentBetUser.equals(userData._id)) {
      console.log('equals');
      userData.balance -= raisedBet - product.currentBet;
    } else {
      console.log('else');
      previousCurrentBetUser.balance += product.currentBet;
      await previousCurrentBetUser.save();

      userData.balance -= raisedBet;
    }

    await userData.save();

    return {
      data: {
        product: await ProductModel.findByIdAndUpdate(productId, {
          currentBet: raisedBet,
          currentBetUser: userData._id,
        }, { new: true }),
        userData: new UserDto(userData),
      },
      success: true,
    };
  }
}

module.exports = new ProductService();
