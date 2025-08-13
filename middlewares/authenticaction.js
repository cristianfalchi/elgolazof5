const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {

    console.log(req.cookies);
    
    const token = req.cookies?.token;
    const url = req.originalUrl;
    let user;

    console.log(token);
    console.log(url);
    

    if (url === '/auth/login') {
        // Si el cliente no envía el token
        if (!token) return res.render('login', { error: '', email: '', password: '' });

        // Si el token es inválido
        user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!user) return res.render('login', { error: 'Token inválido', email: '', password: '' });

    } else {
        // Si el cliente no envía el token
        if (!token) return res.redirect('/auth/login');

        // Si el token es inválido
        user = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!user) return res.redirect('/auth/login');
    }

    req.user = user;
    next();

}


module.exports = {
    authentication
}


// email:
// password:
// rol:
// active:
// url_image: