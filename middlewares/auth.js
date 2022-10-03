// 3. importer le module jsonwebtoken
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            res.status(401).json({ message: 'Not authorized' });
        }

        //1. Reqcuper le token de l'utilisateur connecté
        const token = req.headers.authorization.split(' ')[1];
        //1.1. avant split token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        //1.2. apres split ['Bearer', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9']
        //1.3. 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
        //2. on verifie la validité du token à l'aide de la librairie jsonwebtoken
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        // {
        //     "userId": "632d797365f96c5ca10b14ae",
        //     "iat": 1664791292,
        //     "exp": 1664877692
        // }

        // recuperation de userId 
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };

        next();
    } catch(error) {
        res.status(401).json({ error: error.message });
    }
};
