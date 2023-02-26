const { Router } = require('express');
const OrderController = require('../controllers/Order-controller');
const authMiddleware = require('../middlewares/auth-middleware');
const router = Router();

router.post('/buy', authMiddleware, OrderController.buy);

module.exports = router;
