const { Router } = require('express');
const { authentication } = require('../middlewares/authenticaction');
const { authloginStart, userRegister, getFormAuthLogin, logoutStart } = require('../controllers/auth');

const router = Router();

router.get('/login',authentication, getFormAuthLogin); // mando la referencia del controlador - no estoy ejecutando

router.post('/login',  authloginStart);

router.post('/register', userRegister);
router.get('/logout', authentication, logoutStart);

module.exports = router;

