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

    if (product.isSold) {
      return {
        success: false,
        data: {
          message: 'Товар продано!',
        },
      };
    }


    if (!product.currentBetUser) {
      userData.balance -= raisedBet;
    } else if (product.currentBetUser.equals(userData._id)) {
      userData.balance -= raisedBet - product.currentBet;
    } else {
      previousCurrentBetUser.balance += product.currentBet;
      await previousCurrentBetUser.save();

      userData.balance -= raisedBet;
    }

    await userData.save();

    console.log(`Користувач з id: ${userData._id}, піднняв ставку на товар з id: ${product._id}, до ${raisedBet}`);

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
