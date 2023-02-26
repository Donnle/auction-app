const bcrypt = require('bcrypt');
const UserModel = require('../models/User-model');
const TokenService = require('./Tokens-service');
const UserDto = require('../dtos/User-dto');
const tokenService = require('./Tokens-service');

class UserService {
  async registration(name, surname, email, phone, password) {
    const candidate = await UserModel.findOne({ $or: [{ email }, { phone }] });
    if (candidate) {
      throw new Error(`Користувач з емейлом "${email}" або номером телефону "${phone}" вже існує`);
    }

    const hashPassword = await bcrypt.hash(password, 3);
    const user = await UserModel.create({ email, password: hashPassword, name, surname, phone });

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: { ...userDto } };
  }

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new Error(`Користувач з емейлом "${email}" не найдений`);
    }

    const isPasswordEquals = bcrypt.compareSync(password, user.password);

    if (!isPasswordEquals) {
      throw new Error(`Невірний пароль`);
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: { ...userDto },
    };
  }

  async logout(refreshToken) {
    return await TokenService.removeToken(refreshToken);
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new Error('Користувач не авторизований');
    }

    const userData = TokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await TokenService.findToken(refreshToken);

    if (!userData || !tokenFromDb) {
      throw new Error('Щось пішло не так');
    }

    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });

    await TokenService.saveToken(userDto.id, tokens.refreshToken);
    return {
      ...tokens,
      user: { ...userDto },
    };
  }

  async changeUserData(id, userData) {
    const newUserData = await UserModel.findByIdAndUpdate(id, userData);
    
    const userDto = new UserDto(newUserData);
    return {
      user: { ...userDto },
    };
  }

  async getUserData(accessToken) {
    const userId = await TokenService.validateAccessToken(accessToken).id;
    const userData = await UserModel.findById(userId);

    const userDto = new UserDto(userData);
    return {
      user: { ...userDto },
    };
  }

  async getUserBalance(accessToken) {
    const { id } = tokenService.validateAccessToken(accessToken);
    const userData = await UserModel.findById(id);

    const userDto = new UserDto(userData);
    return {
      balance: userDto.balance,
    };
  }

  async saveDeliveryInfo(accessToken, deliveryCity, deliveryDepartment) {
    const userData = tokenService.validateAccessToken(accessToken);
    const user = await UserModel.findByIdAndUpdate(userData.id, { deliveryCity, deliveryDepartment }, { new: true });

    const userDto = new UserDto(user);
    return {
      user: { ...userDto },
    };
  }
}

module.exports = new UserService();
