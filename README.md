# Sauce API

## Description

Ce projet est une API sécurisée pour une application d'avis gastronomique qui permet aux utilisateurs:

* Ajouter, modifier et supprimer des sauces.
* Aimer une sauce.

### Prerequis

Vous aurez besoin d'avoir Node et `npm` installés localement sur votre machine

### Installation

* Créer un fichier .env à partir du .env.example et mettre les valeurs de vos variables d'environnement (`DB_URL` et `SECRET_KEY`)
* Installez nodemon sur votre machien `npm install -g nodemon`
* Lancez `npm install`
* Lancez le projet `nodemon start`

Le serveur doit fonctionner sur `localhost` avec le port par défaut `3000`. Si le
serveur s'exécute sur un autre port si vous ajouter la variable d'envirenment PORT
console au démarrage du serveur, par ex. `Listening on port 5000`.
