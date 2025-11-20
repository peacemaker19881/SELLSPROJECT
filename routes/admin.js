const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController');
const { ensureAuth, ensureRole } = require('../utils/authMiddleware');

router.get('/pending-products', ensureAuth, ensureRole('admin'), adminCtrl.pendingProducts);
router.post('/approve/:id', ensureAuth, ensureRole('admin'), adminCtrl.approveProduct);

module.exports = router;
