const { validationResult } = require('express-validator');
const user = require('../models/user');
const passport = require('passport');


// ------------------ Renderizar formulario de registro ------------------
module.exports.render_user_register_form = (request, response) => {
    response.render('user/register');
};

// ------------------ Controlador de registro ------------------
module.exports.user_register = async (request, response) => {
    // obtiene todos los errores de validacion captados por el validador de formato en el router
    const errors = validationResult(request);

    if (!errors.isEmpty()) { // si hay errores, se vuelve a renderizar la vista con los errores y los datos ingresados
        return response.render('user/register', {
            errors: errors.array(),
            user: {
                name: request.body.name,
                email: request.body.email
            }
        });
    }

    try {
        const {name, email, password} = request.body; // si no hay errores, se trae del cuerpo de la solicitud los datos ingresados
        
        const user_exists = await user.findOne({where: {email}}); // se busca un usuario con el mismo email ingresado

        if (user_exists) { // si existe un usuario con ese email, 
                          // se notifica que ya está en uso y redirecciona al formulario de registro
            request.flash('error_msg', 'el email ya está registrado');
            return response.redirect('/user/register');
        }

        await user.create({name, email, password}); // sino registra al usuario, muestra un mensaje de exito 
                                                    // y redirecciona al login para iniciar sesión
        request.flash('success_msg', 'registro exitoso. Puede iniciar sesión.');
        response.redirect('/user/login');

    } catch(error) { // si en el medio surgen errores, se capturan y se muestra un mensaje de erorr y el detalle
        console.error('Error al crear al usuario: ', error.message);
        if(error.parent) {
            console.error('Detalle SQL: ', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un error al crear el usuario');
        response.redirect('/user/register');
    }
};

// ------------------ Renderizar formulario de login ------------------
module.exports.render_user_login_form = (request, response) => {
    response.render('user/login');
};

// ------------------ Controlador de login ------------------
module.exports.login_user = (request, response, next) => {
    passport.authenticate('local', {
        successRedirect: '/', // a dónde redirecciona si el registro es exitoso
        failureRedirect: '/user/login', // a dónde redirecciona si el registro falla
        failureFlash: true // mensaje de error si no se puede autenticar
    })(request, response, next);
};

// ------------------ Controlador de cierre de sesión ------------------
module.exports.logout_user =  (request, response, next) => {
    request.logout(error => { // cierra sesión activa. Si hay errores lo pasa al middleware de errores
                              // sino muestra mensaje de exito y redirecciona al login
        if (error) return next(error);
        request.flash('success_msg', 'Sesión cerrada correctamente');
        response.redirect('/user/login');
    });
};

// ------------------ Renderizar perfil ------------------
module.exports.render_profile = async (request, response) => {
    try {
        const user_id = request.user.user_id;
        const user_data = await user.findByPk(user_id);

        if (!user_data) {
            request.flash('error_msg', 'Usuario no encontrado');
            return response.redirect('/home');
        }

        response.render('user/profile', { user: user_data });
    } catch (error) {
        console.error('Error al cargar el perfil:', error.message);
        request.flash('error_msg', 'Ocurrió un error al cargar el perfil');
        response.redirect('/home');
    }
};

// ------------------ Ver perfil ------------------
module.exports.edit_profile = async (request, response) => {
    const errors = validationResult(request); // extrae los errores capturados por el validador de formato en el router
    const user_id = request.user.user_id; // extrae el id del usuario enviado en la request (url)

    if (!errors.isEmpty()) { // si hay errores se renderiza el perfil del usuario junto con los errores, y los datos del usuario
        return response.render('user/profile', {
            errors: errors.array(),
            user: {
                user_id,
                name: request.body.name,
                email: request.body.email
            }
        });
    }

    try {
        const { name, email } = request.body;
        const user_to_update = await user.findByPk(user_id);

        if (!user_to_update) {
            request.flash('error_msg', 'Usuario no encontrado');
            return response.redirect('/home');
        }

        await user_to_update.update({ name, email });
        request.flash('success_msg', 'Perfil actualizado correctamente');
        response.redirect('/home');
    } catch (error) {
        console.error('Error al actualizar el perfil:', error.message);
        request.flash('error_msg', 'Ocurrió un error al actualizar el perfil');
        response.redirect('/home');
    }
};