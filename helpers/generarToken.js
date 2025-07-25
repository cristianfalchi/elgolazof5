const jwt = require('jsonwebtoken');

export const generarToken = async (user) => {

    try {
           // Genero el tokens
        const payload = {
            uid: user.uid,
            nombre: user.nombre,
            apellido: user.apellido,
            correo: user.email
        }

        return jwt.sign(payload, process.env.JWT_SECRET_KEY);

    } catch (error) {
        console.log(error);
        throw error;
        
    }

}