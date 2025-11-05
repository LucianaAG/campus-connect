const {response, request} = require('express');
const user = require('../models/user');
const {validationResult} = require('express-validator');
const Subject = require('../models/subject_model');
const Teacher = require('../models/teacher_model');

// -------------------------------------------------------- ADMIN SESSION CONTROLLERS ---------------------------------------------------------------------------

// ------------------ Controlador de renderizado ------------------

module.exports.render_register_teacher_form = async (request, response) => {
    try {
        const subjects = await Subject.findAll(
            {
                order: [
                    ['name', 'ASC'],
                    ['code', 'ASC']
                ],
                raw: true
            });
            response.render('teacher/register', {subjects});
    } catch (error) {
        console.error('Error al cargar las materias', error.message);
        request.flash('error_msg', 'No se pudieron cargar las materias');
        request.redirect('/');
    }
};

// ------------------ Controlador de registro ------------------

module.exports.register_teacher_form = async (request, response) => {
    const name = request.body ? request.body.name : null;
    const dni = request.body ? request.body.dni : null;
    const specialty = request.body ? request.body.specialty : null;

    try {
        const new_teacher = await Subject.create({
            name,
            dni,
            specialty
        });
        console.log('Nuevo profesor creado:', new_teacher.toJSON());
        console.log('El profesor se ha registrado con exito');
        request.flash('success_msg', 'El profesor se ha registrado con exito');
        response.redirect('/teacher/register')
    } catch (error) {
        console.log('Error al registrar al profesor', error);
        request.flash('error_msg', 'Ocurrió un error al registrar');
        response.redirect('/teacher/register');
    }
};

// ------------------ Controlador de listado ------------------

module.exports.list_teachers = async (request, response) => {
    try {
        const teachers = await Teacher.findAll({raw: true});
        response.render('teacher/list', {teachers});
    } catch (error) {
        console.error('Error al listar los registros', error);
        request.flash('error_msg', 'Ocurrió un error al listar los registros');
        reponse.redirect('/home');
    }
};

// ------------------ Controlador para renderizar form de modificación ------------------

module.exports.render_edit_teacher_form = async (request, response) => {
    try {
        const subjects = await Subject.findAll(
            {
                order: [
                    ['name', 'ASC'],
                    ['code', 'ASC']
                ],
                raw: true
            });
        response.render('teacher/edit', {subjects});
    } catch (error) {
        console.error('Error al cargar las materias', error.message);
        request.flash('error_msg', 'No se pudieron cargar las materias');
        request.redirect('/');
    }
;}

// ------------------ Controlador para actualizar los datos en la bd ------------------

module.exports.edit_teacher_form = async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.render('teacher/edit',
            {
                errors: errors.array(),
                teacher: {
                    name: request.body.name,
                    dni: request.body.dni,
                    specialty: request.body.specialty
                }
            }
        );
    }

    try {
        const teacher_id = request.params.teacher_id;
        const name = request.body.name;
        const dni = request.body.dni;
        const specialty = request.body.specialty;
        
        const update_teache_data = {name, dni, specialty};
        await Teacher.update(update_teache_data, {where: {teacher_id}});
        request.flash('success_msg', "El registro se ha actualizado con exito");
        response.redirect('/teacher/list');

    } catch (error) {
        console.error('error al actualizar el registro', error.message);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un error al actualizar el registro');
        response.redirect('/teacher/list');
    }

};

// ------------------ Controlador de eliminación ------------------

module.exports.delete = async (request, response) => {
    const teacher_id = request.params.teacher_id;
    
    try {
        await Teacher.destroy({where: {teacher_id}});
        request.flash('success_msg', 'El registro se ha eliminado con exito');
        response.redirect('/teacher/list');
    } catch (error) {
        console.error('errro al eliminar el registro', error.message);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un error al eliminar el registro');
        response.redirect('/teacher/list');
    }
};