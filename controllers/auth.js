const { response, request } = require('express');

const Usuario = require('../models/usuario');

const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { generarToken } = require('../helpers/generarToken');

const getFormAuthLogin = (req = request, res = response) => {

    console.log(req.originalUrl);
    return res.render('admin_login', { error: '', email: '', password: '' });

}

const authloginStart = async (req = request, res = response) => {

    try {
        const { email, password } = req.body;

        const user = await Usuario.findOne({ email });

        if (!user) {
            const error = new Error('Usuario no encontrado');
            error.email = email;
            error.password = password;
            throw error;
        }

        const validPass = await bcryptjs.compare(password, user.password);
        if (!validPass) {
            const error = new Error('Contraseña incorrecta');
            error.email = email;
            throw error;
        }

        // Genero el tokens
        const token = await generarToken(user);

        // envio el token al cliente para posteriores peticiones
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin/panel');

    } catch (error) {
        console.log(error);
        res.render('admin_login', {
            email: error?.email,
            password: error?.password,
            error: error.message,
            user: req.user
        });

    }

}

// Creo los usuarios a través de POSTMAN
const userRegister = async (req = request, res = response) => {
    const { email, password } = req.body;


    try {

        // Encriptacion de la contraseña
        const hash = await bcryptjs.hash(password, 10);

        // creo el usuario        
        const user = new Usuario({
            email,
            password: hash,
            rol: 'ADMIN',
            active: true,
            url_image: ''
        })

        await user.save();
        res.status(200).send('Usuario creado con exito');

    } catch (error) {
        console.log(error);
        res.status(500).send('Usuario no pudo ser creado. Consulte con el Administrador');


    }
}

const logoutStart = async (req = request, res = response) => {

    res.clearCookie('token');
    res.redirect('/');
}

module.exports = {
    getFormAuthLogin,
    authloginStart,
    userRegister,
    logoutStart
}
