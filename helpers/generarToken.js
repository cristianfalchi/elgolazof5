// const jwt = require('jsonwebtoken');
import  jwt  from "jsonwebtoken";
export const generarToken = async (user) => {

    try {
           // Genero el tokens
        const payload = {
            id: user._id,
            email: user.email,
            rol: user.rol,
        }

        return jwt.sign(payload, process.env.JWT_SECRET_KEY);

    } catch (error) {
        console.log(error);
        throw error;
        
    }

}