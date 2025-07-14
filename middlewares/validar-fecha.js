// middlewares/validarReservaQuery.js
const { query, validationResult } = require('express-validator');
const moment = require('moment');

const validarReservaQuery = [
    // Validar parámetro "fecha"
    query('fecha')
        .notEmpty().withMessage('La fecha es obligatoria')
        .isISO8601().withMessage('La fecha debe estar en formato YYYY-MM-DD'),

    // Validar parámetro "hora"
    query('hora')
        .notEmpty().withMessage('La hora es obligatoria')
        .matches(/^([0-1][0-9]|2[0-3]|00):00$/).withMessage('La hora debe estar en formato HH:mm')
        .custom((hora) => {
            const horaMoment = moment(hora, 'HH:mm', true);
            const horaMin = moment('12:00', 'HH:mm');

            return hora === '00:00' || horaMoment.isSameOrAfter(horaMin);
        }).withMessage('La hora debe estar entre 12:00 y 00:00'),

    // Manejar errores de validación
    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];

module.exports = {
    validarReservaQuery
}
