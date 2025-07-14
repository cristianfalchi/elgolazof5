// Validador de los custom de express-validator

const Role = require("../models/role");
const Usuario = require("../models/usuario");

const esRolValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        // Lanzamo un error personalizado
        throw new Error(`El rol ${rol} no está registrado el la BD`);
    }
}

// Verificar si el correo existe
const emailExiste = async (correo = '') => {
    const existeEmail = await Usuario.findOne({ correo });
    if (existeEmail) {
        throw new Error(`El correo ${correo} ya está registrado en la BD`);
    }
}

const existeUsuarioPorId = async (id) => {
    const existeId = await Usuario.findOne({_id: id, estado : true});
    // const existeId = await Usuario.findById(id);
    if (!existeId) {
        throw new Error(`El id ${id} no está registrado en la BD`);
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorId
}