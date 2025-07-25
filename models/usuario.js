const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    rol: { type: String, enum: ['ADMIN', 'USER']},
    active:{type: Boolean},
    token: {type: String},
    url_image: {type: String}
});

module.exports = model('Usuario', UsuarioSchema);


