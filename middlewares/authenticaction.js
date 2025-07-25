const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {

    const token = req.cookies?.token;
    const url = req.originalUrl;
    let user;

    // if (url === '/auth/login') {
    //     // Si el cliente no envía el token
    //     if (!token) return res.render('login', {error: ''});

    //     // Si el token es inválido
    //     user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //     if (!user) return res.render('login', {error: ''});

    // } else {
    //     // Si el cliente no envía el token
    //     if (!token) return res.redirect('/auth/login');

    //     // Si el token es inválido
    //     user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //     if (!user) return res.redirect('/auth/login');
    // }

    // req.user = user
    req.user = {
        email: 'cristian@gmail.com',
        password: 'asdasdasdasdad'
    }

    next();

}


module.exports = {
    authentication
}