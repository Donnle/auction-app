const { Router } = require('express');
const ProductController = require('../controllers/Product-controller');
const authMiddleware = require('../middlewares/auth-middleware');

const router = Router();

router.post('/buy', authMiddleware, ProductController.buyProduct);
router.put('/raise-bet', authMiddleware, ProductController.raiseBet);

module.exports = router;
