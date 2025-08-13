const { Router } = require('express');

const { check } = require('express-validator');
const { validarCampos} = require('../middlewares');
const { authentication } = require('../middlewares/authenticaction');
const { authloginStart, userRegister } = require('../controllers/auth');

const router = Router();

router.get('/login',authentication); // mando la referencia del controlador - no estoy ejecutando

router.post('/login', [    
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], authloginStart);

router.post('/register', userRegister);

module.exports = router;

