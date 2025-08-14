const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {

    const token = req.cookies?.token;
    const url = req.originalUrl;

    try {

        req.user = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (url === '/auth/login') return res.redirect('/admin/panel');

        next();

    } catch (error) {

        if (url !== '/auth/login') {
            return res.redirect('/auth/login');
        }
        return res.render('admin_login', { user: req.user, error: '', email: '', password: '' });

    }
}


module.exports = {
    authentication
}

