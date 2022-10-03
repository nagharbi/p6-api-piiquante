const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

// creer un compte  
function validateEmail (emailAdress)
{
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailAdress.match(regexEmail)) {
    return true; 
  } else {
    return false; 
  }
}

exports.signup = (req, res, next) => {
    if (!validateEmail(req.body.email) || req.body.password.trim().length < 6) {
        return res.status(400).json({message : "Il faut entrer un email valide et un mot de passe de 6 caractère au moin!"})
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