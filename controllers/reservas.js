const { response, request } = require('express');

const bcryptjs = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
moment.locale('es'); // establece el idioma

// Paso 1: Importa las partes del módulo que quieras utilizar 
const { MercadoPagoConfig, Payment, Preference } = require("mercadopago");
require('moment/locale/es'); // importa el idioma español

const Turno = require('../models/turno');
const Reserva = require('../models/reserva');
const MedioPago = require('../models/medioPago');
const { checkReferer } = require('../helpers/check-referer');


// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN });
const payment = new Payment(client);

// Estado de los pagos
const estado = {
    "approved": "Aprobado",
    "pending": "Pendiente",
    "rejected": "Rechazado",
}

// Parametros globales - Fecha maxima cacheada


const homeReserva = async (req = request, res = response) => {

    console.log("Ingresando a /home");
    return res.render('index', { title: 'El Golazo Fútbol 5', user: req.user })
}

const calendarioReserva = async (req = request, res = response) => {

    console.log("Ingresando a /calendario");

    const fechaParam = req.query.fecha || moment().subtract(3, 'hours').format('YYYY-MM-DD');
    const fecha = moment(fechaParam);

    const horarios = await Turno.find({ fecha: fechaParam });

    res.render('calendario', {
        fechaISO: fecha.format('YYYY-MM-DD'),
        nombreDia: fecha.format('dddd'),
        fechaFormateada: fecha.format('DD [de] MMMM [de] YYYY'),
        horarios,
        user: req.user
    });
}

const completarReserva = async (req = request, res = response) => {

    const { fecha, hora } = req.query;

    // TODO: Verificaciones de query-params
    // La fecha y la hora tiene que venir si o si
    if (!fecha || !hora) {
        return res.redirect('/calendario');
    }

    // 2. Validar formato de fecha: YYYY-MM-DD
    const fechaValida = moment(fecha, 'YYYY-MM-DD', true).isValid();
    if (!fechaValida) {
        return res.redirect('/calendario');
    }

    // 3. Validar formato de hora: HH:mm
    const horaValida = moment(hora, 'HH:mm', true).isValid();
    if (!horaValida) {
        return res.redirect('/calendario');
    }

    // 4. Validar que esté entre 12:00 y 00:00 inclusive
    const horaMoment = moment(hora, 'HH:mm');
    const horaMin = moment('12:00', 'HH:mm');

    const esMedianoche = hora === '00:00';
    const enRango = horaMoment.isSameOrAfter(horaMin) || esMedianoche;

    if (!enRango) {
        return res.redirect('/calendario');
    }

    // La fecha no debe superar al maximo que tengo cargado en la base de datos
    // console.log(fechaMaximaCache);
    if (fecha > fechaMaximaCache) {
        return res.redirect('/calendario');
    }


    const fechaMoment = moment(fecha, 'YYYY-MM-DD');

    res.render('completar', {
        fechaISO: fecha,
        hora,
        nombreDia: fechaMoment.format('dddd'),
        fechaFormateada: fechaMoment.format('DD [de] MMMM [de] YYYY'),
        user: req.user
    });
}

// Vista previa al pago y procesamiento de la reserva con MP
const confirmarReserva = async (req = request, res = response) => {

    console.log("Ingresando a /completar");

    const { correo, nombre, fecha, hora } = req.body;

    const fechaMoment = moment(fecha);

    res.render('confirmar', {
        correo,
        nombre,
        hora,
        nombreDia: fechaMoment.format('dddd'),
        fechaFormateada: fechaMoment.format('DD [de] MMMM [de] YYYY'),
        user: req.user
    });
}

// Presiona el boton de pagar con mercado pago en la vista "confirmar"
const crearOrdenReserva = async (req = request, res = response) => {

    console.log("Creando Orden de Pago y redirigimos a MP");

    const { correo, nombre, fecha, hora } = req.body;

    const fechaParseada = moment(fecha, 'DD [de] MMMM [de] YYYY', 'es'); // aclarar idioma español
    const fechaOriginal = fechaParseada.format('YYYY-MM-DD'); // "2025-07-06"

    try {

        // grabo la reserva con estado pendiente

        const reserva = new Reserva({
            fecha: fechaOriginal,
            hora,
            usuario: { nombre, correo },
            importe: 3000,
            tipo_de_pago: "APLICACION",
            mercado_pago: {
                external_reference: `reserva_${Date.now()}`,
                status: "pending"
            }
        })

        // Siempre tengo el turno cargado pague o no pague
        await reserva.save();

        const preference = new Preference(client);
        const resultPreference = await preference.create({
            body: {
                items: [
                    {
                        title: 'El Golazo F5 - Turno',
                        quantity: 1,
                        unit_price: 3000
                    }
                ],
                payer: {
                    email: correo,
                    name: nombre
                },
                back_urls: {
                    success: `${process.env.URL_APP}/success`,
                    pending: `${process.env.URL_APP}/pending`,
                    failure: `${process.env.URL_APP}/failure`
                },
                auto_return: "approved",
                external_reference: reserva.mercado_pago.external_reference,
                notification_url: `${process.env.URL_APP}/webhook`
            }

        });

        // Lo redirijo a MP para que pueda pagar
        res.redirect(resultPreference.init_point);

    } catch (error) {
        console.log('Error al crear un pago: ', error);

    }
}

const successReserva = async (req = request, res = response) => {

    // https://elgolazof5.fly.dev/success?collection_id=118175590792&collection_status=approved&payment_id=118175590792&status=approved&external_reference=reserva_1752204468453&payment_type=account_money&merchant_order_id=32334875657&preference_id=2513632303-88649aca-afd0-45f6-b34a-7ac364b2aade&site_id=MLA&processing_mode=aggregator&merchant_account_id=null

    console.log("Ingresando a /success");

    // Compruebo que la solicitud no venga de un usuario comun
    if (checkReferer(req)) {
        return res.redirect('/');
    }

    const {
        external_reference,
        status,
        payment_id,
        payment_type
    } = req.query;

    if (status === "approved") {
        // guardás en tu base de datos:
        // - el usuario (buscás con external_reference)
        // - el estado: pagado
        // - el id de pago: payment_id

        await Reserva.updateOne(
            { "mercado_pago.external_reference": external_reference },
            {
                $set: {
                    "mercado_pago.status": status, // 'approved', 'pending', 'rejected'
                    "mercado_pago.payment_id": payment_id,
                    "mercado_pago.payment_type": payment_type,
                }
            }
        );

        const { importe } = await Reserva.findOne({ "mercado_pago.external_reference": external_reference })
        const { descripcion } = await MedioPago.findOne({ id_medio_pago: payment_type })

        res.render("success", {
            reservaId: external_reference,
            status: estado[status],
            paymentType: descripcion,
            importe,
            user: req.user
        });
    } else {
        res.redirect("failure");
    }
}

const pendingReserva = async (req = request, res = response) => {

    console.log("Ingresando a /pending");

    // Compruebo que la solicitud no venga de un usuario comun
    if (checkReferer(req)) {
        return res.redirect('/');
    }

    res.render('pending');
}

const failureReserva = async (req = request, res = response) => {

    console.log("Ingresando a /failure");

    // Compruebo que la solicitud no venga de un usuario comun
    if (checkReferer(req)) {
        return res.redirect('/');
    }

    try {
        const { external_reference } = req.query;

        // Borro la reserva que se habia generado. El usuario debe volver a reservar
        await Reserva.deleteOne({ "mercado_pago.external_reference": external_reference });

        res.render('failure');

    } catch (error) {
        console.log(error);
    }
}


const webhookReserva = async (req = request, res = response) => {

    console.log("Ingresando a /webhook");

    // Compruebo que la solicitud no venga de un usuario comun
    if (checkReferer(req)) {
        return res.redirect('/');
    }

    try {

        const body = req.body;

        // Mostramos el cuerpo entero (solo para debug)
        console.log('Webhook recibido:', body);

        if (!body || !body.data || !body.data.id) {
            console.warn('Webhook sin data.id, se ignora.');
            return res.sendStatus(200); // igual respondemos 200 para que MP no reintente
        }

        const paymentId = body.data.id;
        console.log(`Webhook recibido. Payment ID: ${paymentId}`);

        // Consultar el detalle real del pago
        const data = await payment.get({ id: paymentId });

        // Obtener datos clave
        const status = data.status;
        const external_reference = data.external_reference;

        // actualizar tu reserva en MongoDB
        await Reserva.updateOne(
            { "mercado_pago.external_reference": external_reference },
            {
                $set: {
                    "mercado_pago.status": status, // 'approved', 'pending', 'rejected'
                    "mercado_pago.payment_id": paymentId,
                    "mercado_pago.payment_type": data.payment_type_id,
                    "mercado_pago.status_detail": data.status_detail,
                }
            }
        );

        const { fecha, hora, usuario } = await Reserva.findOne({ "mercado_pago.external_reference": external_reference })

        // Actualizo el turno
        await Turno.updateOne({ fecha: fecha, "horas.hora": hora },
            {
                $set: {
                    "horas.$.estado": "reservado",
                    "horas.$.nombre": usuario.nombre
                }
            })

        console.log(`Reserva ${external_reference} actualizada como ${status}`);

        res.sendStatus(200); // responder OK a MP

    } catch (error) {
        console.error("Error en webhook:", error);
        res.sendStatus(500); // MP volverá a intentar notificar
    }

}



module.exports = {
    homeReserva,
    calendarioReserva,
    completarReserva,
    confirmarReserva,
    crearOrdenReserva,
    successReserva,
    pendingReserva,
    failureReserva,
    webhookReserva,
}