const { Schema, model } = require('mongoose');

const TurnoSchema = Schema({
    fecha: { type: String, required: [true, 'La fecha es obligatoria'] },// formato YYYY-MM-DD
    horas: [{
        hora: { type: String, required: [true, 'La hora es obligatoria'] },
        estado: { type: String, enum: ['disponible', 'pendiente', 'reservado'], required: true, default: 'disponible' },
        nombre: { type: String }
    }],
});

module.exports = model('Turno', TurnoSchema);