const express = require('express');
const router = express.Router();
const sauceCtrol = require('../controllers/sauce');

router.get('/', sauceCtrol.getAllSauces);
router.get('/:id', sauceCtrol.getOneSauce);
router.post('/', sauceCtrol.createSauce);
router.put('/:id', sauceCtrol.updateSauce);
router.delete('/:id', sauceCtrol.deleteSauce);
router.post('/:id/like', sauceCtrol.likeSauce);

module.exports = router;