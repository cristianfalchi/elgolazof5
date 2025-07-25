const { Router } = require('express');

const { panelAdmin } = require('../controllers/admin');
const { authentication } = require('../middlewares/authenticaction');

const router = Router();

// Protegida con middleware de autenticación
router.get('/panel', authentication, panelAdmin);

module.exports = router;
