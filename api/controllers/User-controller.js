const UserService = require('../services/User-service');

class UserController {
  async registration(req, res, next) {
    try {
      const { name, surname, email, phone, password } = req.body;
      const userData = await UserService.registration(name, surname, email, phone, password);

      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.status(200).send({ data: userData, success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ data: { message: e.message }, success: false });
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await UserService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.status(200).send({ data: userData, success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ data: { message: e.message }, success: false });
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const token = await UserService.logout(refreshToken);

      res.clearCookie('refreshToken');
      res.status(200).send({ data: { refreshToken: token }, success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ data: { message: e.message }, success: false });
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await UserService.refresh(refreshToken);

      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.status(200).send({ data: userData, success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ data: { message: e.message }, success: false });
    }
  }

  async changeUserData(req, res, next) {
    try {
      const { id, name, surname, profileImage } = req.body;
      const newUserData = await UserService.changeUserData(id, { name, surname, profileImage });

      return res.status(200).send({ data: newUserData, success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ data: { message: e.message }, success: false });
    }
  }

  async getUserData(req, res, next) {
    try {
      const { authorization } = req.headers;
      const accessToken = authorization.split(' ')[1];
      const userData = await UserService.getUserData(accessToken);

      return res.status(200).send({ data: userData, success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ data: { message: e.message }, success: false });
    }
  }

  async getUserBalance(req, res, next) {
    try {
      const { authorization } = req.headers;
      const accessToken = authorization.split(' ')[1];

      const data = await UserService.getUserBalance(accessToken);
      return res.status(200).send({ data, success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ data: { message: e.message }, success: false });
    }
  }

  async saveDeliveryInfo(req, res, next) {
    try {
      const { authorization } = req.headers;
      const { deliveryCity, deliveryDepartment } = req.body;

      const accessToken = authorization.split(' ')[1];
      const userData = await UserService.saveDeliveryInfo(accessToken, deliveryCity, deliveryDepartment);

      return res.status(200).send({ data: userData, success: true });
    } catch (e) {
      console.log(e);
      return res.status(400).send({ data: { message: e.message }, success: false });
    }
  }
}

module.exports = new UserController();
