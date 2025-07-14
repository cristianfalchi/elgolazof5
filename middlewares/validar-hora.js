const { query, validationResult } = require('express-validator');
const moment = require('moment');


const validarHora = [

    // Validar parámetro "hora"
    query('hora')
        .notEmpty().withMessage('La hora es obligatoria')
        .matches(/^([0-1][0-9]|2[0-3]|00):00$/).withMessage('La hora debe estar en formato HH:mm')
        .custom((hora) => {
            const horaMoment = moment(hora, 'HH:mm', true);
            const horaMin = moment('12:00', 'HH:mm');

            return hora === '00:00' || horaMoment.isSameOrAfter(horaMin);
        }).withMessage('La hora debe estar entre 12:00 y 00:00'),
];

module.exports = {
    validarHora
}
