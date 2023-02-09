const jwt = require('jsonwebtoken');
const TokenModel = require('../models/Token-model');

const accessSecretKey = '4bee624e-93a1-476b-9170-53d82de17176';
const refreshSecretKey = '33d68775-ac02-4553-a9e9-ffba9025ef7d';

class TokensService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, accessSecretKey, { expiresIn: '10d' });
    const refreshToken = jwt.sign(payload, refreshSecretKey, { expiresIn: '30d' });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    const token = await TokenModel.create({ user: userId, refreshToken });
    return token;
  }

  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, accessSecretKey);
      return userData;
    } catch (e) {
      return null;
    }
  }

  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, refreshSecretKey);
      return userData;
    } catch (e) {
      return null;
    }
  }


  async removeToken(refreshToken) {
    const tokenData = await TokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  async findToken(refreshToken) {
    const tokenData = await TokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

module.exports = new TokensService();
