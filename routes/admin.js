const { Router } = require('express');

const { panelAdmin, mostrarFormularioMes, crearTurnosMes, verReservasPorPeriodo } = require('../controllers/admin');
const { authentication } = require('../middlewares/authenticaction');

const router = Router();

// Protegida con middleware de autenticación
router.get('/panel', authentication, panelAdmin);

router.get('/turnos',authentication, mostrarFormularioMes);
router.post('/turnos',authentication, crearTurnosMes);

// Ruta para ver reservas por periodo
router.get('/reservas-periodo',authentication, verReservasPorPeriodo); 

module.exports = router;
