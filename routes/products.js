const express = require('express');
const router = express.Router();
const prodCtrl = require('../controllers/productController');
const { ensureAuth, ensureRole } = require('../utils/authMiddleware');

router.get('/list', prodCtrl.listPublic);

router.get('/seller/register', ensureAuth, ensureRole('seller'), prodCtrl.showRegisterForm);
router.post('/seller/register', ensureAuth, ensureRole('seller'), prodCtrl.registerProduct);
router.get('/seller/dashboard', ensureAuth, ensureRole('seller'), prodCtrl.sellerDashboard);

module.exports = router;
