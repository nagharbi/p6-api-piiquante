// 1. importer le module express.
const express = require('express');
// 4. importer le module mongoose pour mongodb
const mongoose = require('mongoose');
// 9. importer les routers créer sous le dossier routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const helmet = require('helmet');
// importer le module path
const path = require('path');

require('dotenv').config();

// 2. déclaration app
const app = express();

// 5. connection à la base de donnée 
mongoose.connect(process.env.DB_URL,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.log('Connexion à MongoDB échouée !', error));

// 6. Recevez les données de l'application front-end ( post )
app.use(express.json());
app.use(helmet({ crossOriginResourcePolicy : false }));

// 7. middeleware pour corriger les erreurs CORS afin d'autoriser la communication entre le client et le serveur
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// 8. définition des routes de l'application
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
// la route pour afficher l'image
app.use('/images', express.static(path.join(__dirname, 'images')));

// 3. exporter le module app
module.exports = app;