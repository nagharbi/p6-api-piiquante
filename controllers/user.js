const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
 
const validateEmail = (email) => {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (email.match(regexEmail)) {
        return true; 
    } else {
        return false; 
    }
}

const validatePassword = (password) => {
    let regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}/;
    if (password.match(regexPassword)) {
        return true;
    } else {
        return false;
    }
};

// creer un compte
exports.signup = (req, res, next) => {
    if (!validatePassword(req.body.password)) {
        return res.status(400).json({message : "Le mot de passe doit contenir au minimum huit caractères, au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial!"})
    }

    if (!validateEmail(req.body.email) || req.body.password.trim().length < 6) {
        return res.status(400).json({message : "Il faut entrer un email valide!"})
    }

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        // creer un model
        const user = new User({
            email : req.body.email,
            password: hash
        });

        user.save()
        .then(() => res.status(201).json({message : 'utilisateur créé !'}))
        .catch(error => res.status(400).json({ error: error.message }));
    })
    .catch(error => res.status(500).json({error: error.message}));
};

// pour connecter utlisateur existant 
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(    
                            { userId: user._id },
                            process.env.SECRET_KEY,
                            { expiresIn: '24h' }
                       )
                    });
                })
                .catch(error => res.status(500).json({ error: error.message }));
        })
        .catch(error => res.status(500).json({ error: error.message }));
 }; 