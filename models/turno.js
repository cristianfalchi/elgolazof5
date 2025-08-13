const { Schema, model } = require('mongoose');

const TurnoSchema = Schema({
    fecha: { type: String, required: [true, 'La fecha es obligatoria'], unique: true },// formato YYYY-MM-DD
    horas: [{
        _id: false, // Esto evita que se cree un id en cada objeto del array
        hora: { type: String, required: [true, 'La hora es obligatoria'] },
        estado: { type: String, enum: ['disponible', 'pendiente', 'reservado'], required: true, default: 'disponible' },
        nombre: { type: String }
    }],
});

module.exports = model('Turno', TurnoSchema);