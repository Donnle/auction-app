const { Router } = require('express');
const UserController = require('../controllers/User-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = Router();

router.post('/change-user-data', authMiddleware, UserController.changeUserData);
router.get('/user-data', UserController.getUserData);

module.exports = router;