
const express = require('express');
const router = express.Router();
const userCtrol = require('../controllers/user');

router.post('/signup', userCtrol.signup);
router.post('/login', userCtrol.login);

module.exports = router;