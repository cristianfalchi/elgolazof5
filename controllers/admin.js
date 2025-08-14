const { response, request } = require('express');
const moment = require('moment');

const Turno = require('../models/turno');

const panelAdmin = (req = response, res = request) => {
    console.log("Ingresando a /admin/panel");
     
    res.render('admin_panel', { user: req.user });
};

// GET: formulario
const mostrarFormularioMes = (req, res) => {

    const mensajeExito = req.query.msg;
    const error = req.query.error;

    res.render('admin_turnos', {
        user: req.user,
        moment,
        horas_por_dia: process.env.HORAS_POR_DIA,
        mensajeExito,
        error
    });
};

// POST: crear turnos del mes
const crearTurnosMes = async (req, res) => {
    const { mes, anio, horas, diasHabiles } = req.body;
    let diasHabilesArray = diasHabiles;

    try {
        const horasArray = horas.split(',').map(h => h.trim());
        
        // Por si no selecciono al menos un día
        if(diasHabiles === undefined) throw Error;

        if (!Array.isArray(diasHabilesArray)) {
            diasHabilesArray = [diasHabilesArray];
        };

        const diasPermitidos = diasHabilesArray.map(d => parseInt(d)); // ej: [1, 2, 3, 4, 5] = lunes a viernes

        const fechaInicial = moment(`${anio}-${mes}-01`);
        const fechaFinal = moment(fechaInicial).endOf('month');

        const turnosAGuardar = [];

        while (fechaInicial.isSameOrBefore(fechaFinal)) {
            const diaSemana = fechaInicial.day(); // 0=Domingo, 1=Lunes...6=Sábado

            if (diasPermitidos.includes(diaSemana)) {
                turnosAGuardar.push({
                    fecha: fechaInicial.format('YYYY-MM-DD'),
                    horas: horasArray.map(hora => ({
                        hora,
                        estado: 'disponible',
                        nombre: null
                    }))
                });
            }

            fechaInicial.add(1, 'day');
        }

        await Turno.insertMany(turnosAGuardar);
        res.redirect('/admin/turnos?msg=Turnos agregados correctamente.');

    } catch (error) {
        console.error('Error al generar turnos del mes:', error);
        res.redirect(`/admin/turnos?error=Ocurrió un error al guardar los turnos.`);
    }
};

const verReservasPorPeriodo = async (req = request, res = response) => {
    try {
        const { fechaInicio, fechaFin } = req.query;

        let reservas = [];

        if (fechaInicio && fechaFin) {
            const inicio = moment(fechaInicio, 'YYYY-MM-DD').startOf('day').toDate();
            const fin = moment(fechaFin, 'YYYY-MM-DD').endOf('day').toDate();

            reservas = await Reserva.find({
                fecha: { $gte: inicio, $lte: fin }
            }).sort({ fecha: 1, hora: 1 });
        }

        res.render('admin_reservas_periodo', {
            user: req.user,
            reservas,
            fechaInicio: fechaInicio || '',
            fechaFin: fechaFin || ''
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las reservas');
    }
}

module.exports = {
    panelAdmin,
    mostrarFormularioMes,
    crearTurnosMes,
    verReservasPorPeriodo
}