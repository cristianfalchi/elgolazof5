const { response, request } = require('express');


const panelAdmin = (req = response, res = request) => {
    const nombre = req.user?.nombre || 'Administrador';
    res.render('panel', { nombre });
};


module.exports = {
    panelAdmin,
}