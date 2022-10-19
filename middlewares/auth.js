// pour securiser l'API sauce j'ai creer un middlewares d'autorisation 
// rendre l'API SAUCE api privé

// 3. importer le module jsonwebtoken
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // Utilisateur non authoriser
        if (!req.headers.authorization) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        //1. Reqcuper le token de l'utilisateur connecté
        const token = req.headers.authorization.split(' ')[1];
        //2. on verifie la validité du token à l'aide de la librairie jsonwebtoken
        // et decoder le token (user id ....)
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        // recuperation de userId 
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };

        next();
    } catch(error) {
        return res.status(401).json({ error: error.message });
    }
};
