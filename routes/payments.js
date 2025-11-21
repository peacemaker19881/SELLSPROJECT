const express = require('express');
const router = express.Router();
const payCtrl = require('../controllers/paymentController');
const { ensureAuth } = require('../utils/authMinddleware');

router.post('/buy/:productId', ensureAuth, payCtrl.initiatePurchase);
router.post('/webhook', payCtrl.webhook);

module.exports = router;
