const { Router } = require('express');

const { check } = require('express-validator');
const { validarCampos} = require('../middlewares');
const { authentication } = require('../middlewares/authenticaction');
const { login, authloginStart } = require('../controllers/auth');

const router = Router();

router.get('/login',authentication, login); // mando la referencia del controlador - no estoy ejecutando

router.post('/login', [    
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], authloginStart);


module.exports = router;

