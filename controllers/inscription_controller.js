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

// ------------------ Controlador de registro ------------------
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

// ------------------ Controlador de listado ------------------

module.exports.inscriptions_list = async (request, response) => {

        try {
        const inscriptions = await Inscription.findAll({raw: true});
        response.render('inscription/list', {inscriptions});
    } catch (error) {
        console.log('Error al listar los registros', error);
        request.flash('error_msg', 'Ocurrió un error al listar los registros');
        response.redirect('/home');
    }
};

module.exports.render_inscription_edit_form = async (request, response) => {
    try {
        const subjects = await Subject.findAll({
            order: [['name', 'ASC']],
            raw: true
        });

        const students = await Student.findAll({
            order: [['name', 'ASC']],
            raw: true
        });

        response.render('inscription/edit', {subjects, students});
    } catch (error) {
        console.error('error al cargar materias y estudiantes:', error.message);
        request.flash('error_msg', 'no se pudieron cargar las materias y estudiantes');
        response.redirect('/');
    }
};

module.exports.inscription_edit_form = async (request, response) => {
    const errors = validationResult(request);
    const inscription_id = request.params.inscription_id;

    if (!errors.isEmpty()) {
        response.redirect('/inscription/edit',
            {
                errors: errors.array(),
                inscription: {
                    student_id: request.body.student_id,
                    subject_id: request.body.subject_id,
                    inscription_date: request.body.inscription_date
                }
            }
        );
    }

    try {
        const student_id = request.body.student_id
        const subject_id = request.body.subject_id
        const inscription_date = request.body.inscription_date

        const update_data = {student_id, subject_id, inscription_date};
        await Inscription.update(update_data, {where: {inscription_id}});
        request.flash('succes_msg', 'El registro se ha actualizado con exito');
        response.redirect('/inscription/list');
    } catch (error) {
        console.error('Error al actualizar el registro', error.message);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un erorr al actualizar el registro');
        response.redirect('/inscription/list');
    }
};

// ------------------ Controlador de eliminación ------------------
module.exports.delete_inscription = async (request, response) => {
    const inscription_id = request.params.inscription_id;

    try {
        await Inscription.destroy({where: {inscription_id}});
        request.flash('success_msg', 'El registro se ha eliminado con exito');
        response.redirect('(student/list');
    } catch (error) {
        console.error('errro al eliminar el registro', error.message);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un error al eliminar el registro');
        response.redirect('/student/list');
    }
};