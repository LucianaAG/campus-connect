module.exports.ensure_authenticated = (req, res, next) => {
    if (req.isAuthenticated()) { 
        // el usuario está autenticado (Passport guarda esto en la sesión)
        return next(); 
    }

    // el usuario no está autenticado
    req.flash('error_msg', 'Por favor inicia sesión para acceder a esta página');
    res.redirect('/user/login');
};