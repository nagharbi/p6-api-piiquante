// 1. importer le module multer
const multer = require('multer');

// 2. initialiser les differents type d'image souhaité
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

// 3. configurer et appeler la fonction diskStorage
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

// 4. exporter multer
module.exports = multer({storage: storage}).single('image');