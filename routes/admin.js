const { Router } = require('express');

const { panelAdmin, mostrarFormularioMes, crearTurnosMes } = require('../controllers/admin');
const { authentication } = require('../middlewares/authenticaction');

const router = Router();

// Protegida con middleware de autenticación
router.get('/panel', authentication, panelAdmin);

router.get('/turnos',authentication, mostrarFormularioMes);
router.post('/turnos',authentication, crearTurnosMes);

module.exports = router;
