const { Router } = require('express');
const MarketController = require('../controllers/Market-controller');

const router = Router();

router.post('/get-products', MarketController.getProducts);
router.post('/get-product', MarketController.getProduct);

module.exports = router;
