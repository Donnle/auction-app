const { Router } = require('express');
const UserController = require('../controllers/User-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = Router();

router.post('/change-user-data', authMiddleware, UserController.changeUserData);
router.get('/user-data', authMiddleware, UserController.getUserData);
router.get('/user-balance', authMiddleware, UserController.getUserBalance);
router.put('/delivery/save-address', authMiddleware, UserController.saveDeliveryInfo);

module.exports = router;
