const { response, request } = require('express');

const Usuario = require('../models/usuario');

const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { generarToken } = require('../helpers/generarToken');

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

        console.log(token);

        // envio el token al cliente para posteriores peticiones
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/admin/panel');

    } catch (error) {
        console.log(error);
        res.render('login', {
            email: error?.email,
            password: error?.password,
            error: error.message
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

module.exports = {
    authloginStart,
    userRegister
}
