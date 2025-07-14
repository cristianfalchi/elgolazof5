// Voy a ocupar la conexion de mongoose
const mongoose = require('mongoose');


const dbConnection = async () => {

    // Como es una conexion a una DB donde yo no tengo el control absoluto, siempre es bueno hacer un try/catch
    try {

        await mongoose.connect(process.env.MONGODB_CNN);
        console.log('Base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

module.exports = {
    dbConnection
}