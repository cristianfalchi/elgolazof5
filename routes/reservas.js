const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos} = require('../middlewares');

const {
    homeReserva,
    calendarioReserva,
    completarReserva,
    confirmarReserva,
    crearOrdenReserva,
    successReserva,
    pendingReserva,
    failureReserva,
    webhookReserva,
} = require('../controllers/reservas');

const router = Router();

router.get('/', homeReserva); // mando la referencia del controlador - no estoy ejecutando
router.get('/calendario', calendarioReserva);
router.get('/completar', completarReserva); // 1ro damos la opcion de colocar el nombre de la persona que reserva
router.post('/confirmar', [
    check('correo', 'El correo no es válido').isEmail(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], confirmarReserva); // 2do mostramos quien reservó y desde aqui pasamos a pagar por MP

router.post('/create-order', [
    check('correo', 'El correo no es válido').isEmail(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearOrdenReserva); //3ro Boton donde Pagamos con mercado pago. un usuario va a pagar. Generar la cuenta
router.get('/success', successReserva); //4to Mercado Pago usará para redirigir cuando el usuario paga
router.get('/pending', pendingReserva); //4to Mercado Pago usará para redirigir cuando el usuario paga
router.get('/failure', failureReserva); //4to Mercado Pago usará para redirigir cuando el usuario paga
router.post('/webhook', webhookReserva); //5to Mercado Pago envía un POST con el cuerpo JSON cuando te avisa que llegó el pago

module.exports = router;

