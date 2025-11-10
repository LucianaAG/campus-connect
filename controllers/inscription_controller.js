const {validationResult} = require('express-validator');
const Inscription = require('../models/inscription_model');
const Subject = require('../models/subject_model');
const Student = require('../models/student_model');

// -------------------------------------------------------- ADMIN SESSION CONTROLLERS ---------------------------------------------------------------------------

// ------------------ Controlador de renderizado ------------------

module.exports.render_inscription_register_form = async (request, response) => {
    try {
        const subjects = await Subject.findAll({
            order: [['name', 'ASC']],
            raw: true
        });

        const students = await Student.findAll({
            order: [['name', 'ASC']],
            raw: true
        });

        response.render('inscription/register', {subjects, students});
    } catch (error) {
        console.error('error al cargar materias y estudiantes:', error.message);
        request.flash('error_msg', 'no se pudieron cargar las materias y estudiantes');
        response.redirect('/');
    }
};

module.exports.inscription_register_form = async (request, response) => {
    const subject_id = request.body.subject_id;
    const student_id = request.body.student_id;
    const inscription_date = request.body.inscription_date;

    try {
        const new_inscription = await Inscription.create({
            subject_id,
            student_id,
            inscription_date
        });
        console.log('Nueva inscripción registrada', new_inscription.toJSON());
        request.flash('success_msg', 'La inscripción se ha registrado con exito');
        response.redirect('/inscription/register');

    } catch (error) {
        console.log('Error al registrar la inscripción', error);
        request.flash('error_msg', 'Ocurrió un error al registrar la inscripción')
        response.redirect('/inscription/register');
    }
};
