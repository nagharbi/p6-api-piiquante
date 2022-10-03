
// 1. importer le module express
const express = require('express');
// 2. appeler Router() sous express
// router pour definir les methods (get, post, delete, put)
const router = express.Router();
// 4. importer le controlleur user.
const userCtrol = require('../controllers/user');

// 5. generer les routes
router.post('/signup', userCtrol.signup);
router.post('/login', userCtrol.login);

// 3. exporte le module router. 
module.exports = router;