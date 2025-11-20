const express = require('express');
const router = express.Router();
const payCtrl = require('../controllers/paymentController');
const { ensureAuth } = require('../utils/authMiddleware');

router.post('/buy/:productId', ensureAuth, payCtrl.initiatePurchase);
router.post('/webhook', payCtrl.webhook);

module.exports = router;
