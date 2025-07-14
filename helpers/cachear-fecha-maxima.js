const Turno = require("../models/turno");

// Función para actualizar el cache desde la base
async function actualizarCacheFechaMaxima() {
  const turnoMasLejano = await Turno.findOne()
    .sort({ fecha: -1 })
    .select('fecha')
    .lean();

  if (turnoMasLejano) {
    global.fechaMaximaCache = turnoMasLejano.fecha;
    return;
  }
}

module.exports = {
  actualizarCacheFechaMaxima,
}
