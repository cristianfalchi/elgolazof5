const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.hostname = "0.0.0.0";

        // Middleware para recibir JSON - Lectura y parseo del body
        this.app.use(express.json()); // Serializar json

        // Path string
        this.paths = {
            home: '/',
            auth: '/auth',
            admin:'/admin'
        }

        // Conectar a Base de datos. Justo cuando se esta creando la instancia de mi servidor
        this.conectarDB();

        // Vamos a servir la carpeta publica
        // Middlewares
        this.middlewares();


        // Rutas de mi aplicacion
        this.routes();

    }

    async conectarDB() {
        // Podriamos seleccionar distintas DB si quiesieramos
        await dbConnection();
    }


    middlewares() {
        // CORS (Compartición de Recursos entre Orígenes). 
        // Por defecto, un navegador bloquea las peticiones AJAX (fetch, axios, etc.) entre sitios de distinto origen.
        // Si no habilitás CORS, el navegador bloquea las peticiones al backend.
        this.app.use(cors());

        //Directorio publico
        this.app.use(express.static('public'));

        // Motor de plantillas que se utilizará
        this.app.set('view engine', 'ejs');

        this.app.use(express.urlencoded({
            extended: true,
        }));
    }

    routes() {
        this.app.use(this.paths.home, require('../routes/reservas'));
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.admin, require('../routes/admin'));

        //  Si querés redirigir todo tipo de métodos (GET, POST, etc.), podés usar:
        this.app.use((req, res) => { res.redirect('/') });


    }

    listen() {
        this.app.listen(this.port, this.hostname, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}


module.exports = Server;