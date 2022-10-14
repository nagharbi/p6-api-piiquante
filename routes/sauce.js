const express = require('express');
const router = express.Router();
const sauceCtrol = require('../controllers/sauce');
// importer le middelware auth
// pour securiser l'API Sauce (elle devient une API privée)
const authMiddleware = require('../middlewares/auth');
// importer le middelware multer-congig
const multerMiddleware = require('../middlewares/multer-config');

router.get('/', authMiddleware, sauceCtrol.getAllSauces);
router.get('/:id', authMiddleware, sauceCtrol.getOneSauce);
router.post('/', authMiddleware, multerMiddleware, sauceCtrol.createSauce);
router.put('/:id', authMiddleware, multerMiddleware, sauceCtrol.updateSauce);
router.delete('/:id', authMiddleware, sauceCtrol.deleteSauce);
router.post('/:id/like', authMiddleware, sauceCtrol.likeSauce);

module.exports = router;