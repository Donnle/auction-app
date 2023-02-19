const { Router } = require('express');
const ProductController = require('../controllers/Product-controller');
const router = Router();

router.put('/raise-bet', ProductController.raiseBet);

module.exports = router;
