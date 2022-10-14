const mongoose = require('mongoose');
// Pour rendre l'email unique
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
});

userSchema.plugin(uniqueValidator);

// Exporter le model User
module.exports = mongoose.model('User', userSchema);