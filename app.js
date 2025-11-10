// ------------------ Librerías ------------------
const express = require('express');
const app = express();
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const { create } = require('express-handlebars');
const hbs = require('handlebars');

// ------------------ Routers ------------------
const home_controller = require('./controllers/home_controller');
const user_router = require('./routes/user_routes');
const teacher_routes = require('./routes/teacher_routes');
const subject_routes = require('./routes/subject_routes');
const student_routes = require('./routes/student_routes');
const inscription_routes = require('./routes/inscription_routes');
// ------------------ Configuración Handlebars ------------------
const handlebars_instance = create({
  extname: '.hbs',
  defaultLayout: 'main'
});

app.engine(".hbs", handlebars_instance.engine);
app.set("view engine", ".hbs");
app.set("views", "./views");

hbs.registerHelper('eq', (a, b) => a === b);

// ------------------ Middlewares ------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ------------------ Configuración de sesión ------------------
app.use(session({
    secret: process.env.COD_ENCRIPTATION,
    resave: false,
    saveUninitialized: false,
    name: 'secret-name',
    cookie: { expires: 600000 }
}));

// ------------------ Configuración de passport ------------------
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// ------------------ Rutas ------------------
app.get('/', home_controller.home);
app.use('/user', user_router);
app.use('/teacher', teacher_routes);
app.use('/subject', subject_routes);
app.use('/student', student_routes);
app.use('/inscription', inscription_routes);

// ------------------ Base de Datos ------------------
const {sequelize_connection, ensure_database} = require('./database/conexion_mysql_db');

const PORT = process.env.PORT || 5000; // Cambiado a puerto 5000 por defecto

(
    async() => {
        try {
            await ensure_database();
            await sequelize_connection.sync();
            console.log('Base de datos y tablas listas');

            // Solo una llamada a listen, después de la inicialización de la BD
            app.listen(PORT, () => {
                console.log('Servidor corriendo en el puerto: ' + PORT);
            });
        } catch (error) {
            console.error('Error al inicializar la BD: ', error);
        }
})();