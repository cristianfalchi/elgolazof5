const { response, request } = require('express');

const Usuario = require('../models/usuario');

const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const login = (req = request, res = response) => {

    res.render('login', { error: '' });

}

const authloginStart = async (req = request, res = response) => {


    try {
        const { email, password } = req.body;

        const admin = await Usuario.findOne({ email });
        if (!admin) throw new Error('Usuario no encontrado');

        const validPass = await bcrypt.compare(password, admin.password);
        if (!validPass) throw new Error('Contraseña incorrecta');

        // Genero el tokens
        const token = await generarToken(admin);

        // envio el token al cliente para posteriores peticiones
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin/panel');

    } catch (error) {
        console.log(error);
        res.render('login', { error: error.message });

    }

}

module.exports = {
    login,
    authloginStart
}
