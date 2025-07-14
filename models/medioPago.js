const { Schema, model } = require('mongoose');

const MedioPagoSchema = Schema({
    id_medio_pago: { type: String, required: true, unique: true },   // ej: "account_money"
    descripcion: { type: String, required: true },        // ej: "Dinero en cuenta"
    categoria: { type: String }                           // opcional, ej: "billetera", "tarjeta"
});

module.exports = model('MedioPago', MedioPagoSchema);