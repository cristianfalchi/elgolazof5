require('dotenv').config();
const { actualizarCacheFechaMaxima } = require('./helpers/cachear-fecha-maxima');
const Server = require('./models/server');

// Variables Globales
global.fechaMaximaCache = '';

// Actualizo variable global
(async () => {
    await actualizarCacheFechaMaxima(); // esto actualiza global.fechaMaximaCache por dentro
})();

const server = new Server();

server.listen();




