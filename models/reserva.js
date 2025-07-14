const { Schema, model } = require('mongoose');

const ReservaSchema = Schema({
  fecha: { type: String, required: true }, // formato YYYY-MM-DD
  hora: { type: String, required: true },  // formato HH:mm
  usuario: {
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
  },
  importe: { type: Number, required: true}, // almacena el importe de seña de la reserva por MP
  tipo_de_pago: {type: String, enum: ["EFECTIVO", "APLICACION", "TRANSFERENCIA"]},
  mercado_pago: {
    external_reference: { type: String }, // Para identificar la reserva internamente
    status: { type: String }, // "approved", "pending"
    payment_id: { type: String },
    payment_type:{ type: String }, // forma de pago
    status_detail: { type: String }
  }
});

module.exports = model('Reserva', ReservaSchema);

// Cuando el usuario completa el pago y Mercado Pago hace el redirect (por el back_urls),
// te manda a tu ruta /success con query parameters en la URL.
// http://localhost:3000/success?collection_id=1234567890&collection_status=approved&payment_id=1234567890&status=approved&external_reference=reserva_1751253108687&payment_type=credit_card&merchant_order_id=223344&preference_id=...&site_id=MLA&processing_mode=aggregator&merchant_account_id=null
// {
//       collection_id: '1234567890',
//       collection_status: 'approved',
//       payment_id: '1234567890',
//       status: 'approved',
//       external_reference: 'reserva_1751253108687',
//       payment_type: 'credit_card',
//       merchant_order_id: '223344',
//       preference_id: '...',
//       site_id: 'MLA',
//       processing_mode: 'aggregator',
//       merchant_account_id: null
//     }