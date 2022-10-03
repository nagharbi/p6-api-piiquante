const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getAllSauces = (req, res) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error =>res.status(500).json({error}));
};

exports.getOneSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(500).json({error}));
};

exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;

    if (!sauceObject.name || sauceObject.name.trim().length < 2) {
        return res.status(400).json({ message: 'Il faut saisir un nom valide au moin 2 caractéres !' })
    }

    if (!sauceObject.manufacturer || sauceObject.manufacturer.trim().length < 2 ) {
        return res.status(400).json({ message: 'Il faut saisir un nom fabriquant valide au moin 2 caractéres  !' })
    }

    if (!sauceObject.description || sauceObject.description.trim().length < 2 ) {
        return res.status(400).json({ message: 'La description doit avoir au moin 2 caractéres  !' })
    }

    if (!sauceObject.mainPepper || sauceObject.mainPepper.trim().length < 2 ) {
        return res.status(400).json({ message: 'Il faut saisir les ingredients de la sauce au moin de 2 caractéres  !' })
    }

    if (!sauceObject.heat || sauceObject.heat < 1 || sauceObject.heat > 10 ) {
        return res.status(400).json({ message: 'Le degré de la sauce doit etre entre 1 et 10' })
    }

    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    sauce.save()
    .then(() => {res.status(201).json({message: 'Sauce enregistré!'})})
    .catch((error) => { res.status(500).json({ error: error.message })});
};

exports.updateSauce = (req, res) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } :
        { ...req.body };
    delete sauceObject.userId;

    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId !== req.auth.userId) {
                res.status(403).json({ message : 'unauthorized request'});
            } else {
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id:  req.params.id })
                    .then(() => {
                        if (req.file) {
                            const filename = sauce.imageUrl.split('/images/')[1];
                            fs.unlink(`images/${filename}`, () => {});
                        }
                        res.status(200).json({message : 'Sauce modifié!'});
                    })
                    .catch(error => res.status(500).json({ error: error.message }));
            }
        })
        .catch(error => res.status(500).json({ error: error.message }));
};

exports.deleteSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId){
                res.status(403).json({ message: 'unauthorized request' });
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({ message: 'Sauce supprimé !' })})
                        .catch(error => res.status(500).json({ error: error.message }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error: error.message });
        }); 
};

exports.likeSauce = (req, res) => {
};


