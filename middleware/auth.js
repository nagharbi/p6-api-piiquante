const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{
    try {
        // le token de l'utilisateur connecté
        const token = req.headers.authorization.split(' ')[1];
        // on verfier la validité du token 
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        // recuperation de userId 
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        }
        next();
    } catch(error) {
        res.status(401).json({error});
    }
};
