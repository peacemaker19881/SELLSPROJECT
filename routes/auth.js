const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { ensureAuth } = require('../utils/authMinddleware');

router.get('/login', auth.showLogin);
router.get('/register', auth.showRegister);
router.post('/register', auth.register);
router.post('/login', auth.login);
router.get('/logout', ensureAuth, auth.logout);

module.exports = router;
