const tokenService = require('../services/Tokens-service');

module.exports = function(req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(400).json({ data: { message: 'Упущений авторизаційний заголовок' }, success: false });
    }

    const accessToken = authorizationHeader.split(' ')[1];
    if (!accessToken) {
      return res.status(400).json({ data: { message: 'Упущений авторизаційний токен' }, success: false });
    }

    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return res.status(400).json({ data: { message: 'Невірний access токен' }, success: false });
    }

    req.user = userData;
    next();
  } catch (e) {
    return res.status(400).json({ data: { message: e.message }, success: false });
  }
};
