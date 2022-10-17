// impoter le model sauce
const Sauce = require('../models/sauce');
// importer la lib fs pour la gestion des fichiers
const fs = require('fs');

const validationSauce = (sauce) => {

    if (!sauce.name || sauce.name.trim().length < 2) {
        return 'Il faut saisir un nom valide au moin 2 caractéres !';
    }

    if (!sauce.manufacturer || sauce.manufacturer.trim().length < 2 ) {
        return 'Il faut saisir un nom fabriquant valide au moin 2 caractéres  !';
    }

    if (!sauce.description || sauce.description.trim().length < 2 ) {
        return 'La description doit avoir au moin 2 caractéres  !';
    }

    if (!sauce.mainPepper || sauce.mainPepper.trim().length < 2 ) {
        return 'Il faut saisir les ingredients de la sauce au moin de 2 caractéres  !';
    }

    if (!sauce.heat || sauce.heat < 1 || sauce.heat > 10 ) {
        return 'Le degré de la sauce doit etre entre 1 et 10';
    }

    return '';
}

// Le prefix de la route /api/sauces
// La logique de la route GET /
exports.getAllSauces = (req, res) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error =>res.status(500).json({error: error.message}));
};

// La logique de la route GET /:id
exports.getOneSauce = (req, res) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(500).json({error: error.message}));
};

// La logique de la route POST /
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;

    const message = validationSauce(sauceObject);
    if (message.length > 0) {
        return res.status(400).json({ message });
    }

    // Créer l'instance sauce.
    // destruction de l'objet ...sauceObject
    // remplir userId par l'id de l'utilisateur recuperer depuis req.auth
    // remplir imageUrl depuis les datas envoyer sous req par multer (req.protocol, req.get('host) et req.file.filename)
    // initialiser likes et dislikes à 0 et usersLiked et usersDisliked à un tableau vide
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    // Enregistre la sauce en utilisant la méthode mongoose save
    sauce.save()
    .then(() => {res.status(201).json({message: 'Sauce enregistrée!'})})
    .catch((error) => { res.status(500).json({ error: error.message })});
};

// La logique de la route PUT /:id
exports.updateSauce = (req, res) => {
    // si j'ai mis à jour l'image de la sauce j'obtiens req.file et je doit parse req.body.sauce
    // et ajouter l'imageUrl
    // sinon je fais une destruction de l'objet req.body
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } :
        { ...req.body };

    delete sauceObject.userId;
    
    const message = validationSauce(sauceObject);
    if (message.length > 0) {
        return res.status(400).json({ message });
    }

    // Rechercher la sauce à modifier
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            // Verifier si l'utilisateur celui qui a creer la Sauce
            // Il ne peut pas modifier une sauce d'un autre utilisateur
            if (sauce.userId !== req.auth.userId) {
                return res.status(403).json({ message : 'unauthorized request'});
            } else {
                // Mettre à jour la sauce en utilisant la méthode updateOne de mongoose
                // qui prend en paramètre l'id de la sauce à modifier
                // et l'objet sauce modifié
                Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id:  req.params.id })
                    .then(() => {
                        if (req.file) {
                            // Dans le cas où j'ai modifié l'image de la sauce.
                            // Recupere le nom du fichier depuis sauce.imageUrl
                            const filename = sauce.imageUrl.split('/images/')[1];
                            // fs.unlink permet de supprimer un fichier
                            // Supprimer le fichier sous images
                            fs.unlink(`images/${filename}`, () => {});
                        }
                        return res.status(200).json({message : 'Sauce modifiée!'});
                    })
                    .catch(error => res.status(500).json({ error: error.message }));
            }
        })
        .catch(error => res.status(500).json({ error: error.message }));
};

// La logique de la route DELETE /:id
exports.deleteSauce = (req, res) => {
    // Rechercher la sauce à supprimer
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            // Verifier si l'utilisateur celui qui a creer la Sauce
            // Il ne peut pas supprimer une sauce d'un autre utilisateur
            if (sauce.userId != req.auth.userId){
                res.status(403).json({ message: 'unauthorized request' });
            } else {
                // Recupere le nom du fichier depuis sauce.imageUrl
                const filename = sauce.imageUrl.split('/images/')[1];
                // Supprimer le fichier sous images
                fs.unlink(`images/${filename}`, () => {
                    // Supprimer la sauce en utilisant la méthode deleteOne de mongoose
                    // qui prend en parametre l'id de la sauce
                    sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({ message: 'Sauce supprimée!' })})
                        .catch(error => res.status(500).json({ error: error.message }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error: error.message });
        }); 
};

// La fonction likeDislike qui permet de gérer le like et dislike d'une sauce
const likeDislike = (userId, like, sauce)  => {
    // Initialiser sauceUpdated à null
    let sauceUpdated = null;
    let message = '';

    // Like la sauce
    if (like === 1) {
        if (!sauce.usersLiked.includes(userId) && !sauce.usersDisliked.includes(userId)) {
            // incrémenter likes par 1 ($inc) et ajouter userId dans usersLiked ($push)
            sauceUpdated = {$inc: {likes: 1}, $push: {usersLiked: userId}};
            message = `${userId} a aimer la sauce`;
        } else {
            message = 'Vous ne pouvez plus liker!';
        }
    }

    // Dislike la sauce
    if (like === -1) {
        if (!sauce.usersLiked.includes(userId) && !sauce.usersDisliked.includes(userId)) {
            // incrémenter dislikes par 1 ($inc) et ajouter userId dans usersDisliked ($push)
            sauceUpdated = {$inc: {dislikes: 1}, $push: {usersDisliked: userId}};
            message = `${userId} n'a pas aimer la sauce`;
        } else {
            message = 'Vous ne pouvez plus disliker!';
        }
    }

    // Retirer le like de la sauce
    // includes Permet de déterminer si un tableau contient une valeur et renvoie true si c'est le cas, false sinon
    if (like === 0 && sauce.usersLiked.includes(userId)) {
        // retirer le like ($inc) et retirer userId du tableau usersDisliked ($pull)
        sauceUpdated = {$inc: {likes: -1}, $pull: {usersLiked: userId}};
        message = `Le like a été retirer par ${userId}`;
    }

    // Retirer le dislike de la sauce
    if (like === 0 && sauce.usersDisliked.includes(userId)) {
        // Retirer le dislike ($inc) et retirer userId du tableau usersDisliked ($pull)
        sauceUpdated = {$inc: {dislikes: -1}, $pull: {usersDisliked: userId}};
        message = `Le dislike a été retirer par ${userId}`;
    }

    // Retourner un objet qui contient 
    // sauceUpdated: la sauce à modifer 
    // un message de l'acion
    return {sauceUpdated, message};
}

// La logique de la route POST /:id/like
exports.likeSauce = (req, res) => {
    const userId = req.auth.userId;
    const like = req.body.like;

    // Rechercher la sauce selectionné pour verifier si l'utilisateur à retirer le like ou dislike
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        // desctruction sauceUpdated et message de l'objet retourner par la fonction likeDislike
        const {sauceUpdated, message} = likeDislike(userId, like, sauce);

        // Verfier si la sauce est bien modifié
        if (sauceUpdated) {
            // Si oui mettre à jour la sauce.
            Sauce.updateOne({ _id: req.params.id }, sauceUpdated)
                .then(() => res.status(200).json({ message }))
                .catch(error => res.status(500).json({ error: error.message }));
        } else {
            // Si non retourner Mauvaise demande.
            return res.status(400).json({ message: message || 'Mauvaise demande!' })
        }
    })
    .catch(error => res.status(500).json({error: error.message}));
};
