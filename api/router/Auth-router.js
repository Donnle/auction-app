const { Router } = require('express');
const UserController = require('../controllers/User-controller');

const router = Router();

router.post('/registration', UserController.registration);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);

router.get('/refresh', UserController.refresh);

module.exports = router;
