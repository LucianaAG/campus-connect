const {response, request} = require('express');
const {validationResult} = require('express-validator');
const Student = require('../models/student_model');


// -------------------------------------------------------- ADMIN SESSION CONTROLLERS ---------------------------------------------------------------------------


module.exports.render_student_register_form = async (request, response) => {
    response.render('student/register');
};

// ------------------ Controlador de renderizado ------------------

module.exports.student_register_form = async (request, response) => {
    const name = request.body.name;
    const dni = request.body.dni;
    const birth_date = request.body.birth_date;
    const status = request.body.status;

    try {
        const new_student = await Student.create({
            name,
            dni,
            birth_date,
            status
        });
        console.log('Nuevo estudiante creado', new_student.toJSON());
        console.log('El estudiante se ha registrado con exito');
        request.flash('success_msg', 'El estudiante se ha registrado con exito');
        response.redirect('/student/register');
    } catch (error) {
        console.log('Error al registrar al estudiante', error);
        request.flash('error_msg', 'Ocurrió un error al registrar al estudiante');
        response.redirect('/student/register');
    }
};

// ------------------ Controlador de registro ------------------

module.exports.list_students = async (request, response) => {
    try {
        const students = await Student.findAll({raw: true});
        response.render('student/list', {students});
    } catch (error) {
        console.log('Error al listar los registros', error);
        request.flash('error_msg', 'Ocurrió un error al listar los registros');
        response.redirect('/home');
    }
};


// ------------------ Controlador de modificacion ------------------
module.exports.render_student_edit_form = async (request, response) => {
   const student_id = request.params.student_id;

    try {
        const student = await Student.findByPk(student_id);

        if (!student) {
            request.flash('error_msg', 'El estudiante no existe');
            return response.redirect('/student/list');
        }

        return response.render('student/edit', {
        student: { student_id: request.params.student_id }
        });
    } catch (error) {
        console.error('Error al obtener el estudiante:', error.message);
        request.flash('error_msg', 'Ocurrió un error al cargar el formulario de edición');
        return response.redirect('/student/list');
    }
};

module.exports.student_edit_form = async (request, response) => {
    const errors = validationResult(request);
    const student_id = request.params.student_id;

    if (!errors.isEmpty()) {
        return response.redirect('/student/edit',
            {
                errors: errors.array(),
                student: {
                    name: request.body.name,
                    dni: request.body.dni,
                    birth_date: request.body.birth_date,
                    status: request.body.status
                }
            }
        );
    }

    try {
        const name = request.body.name;
        const dni = request.body.dni;
        const birth_date = request.body.birth_date;
        const status = request.body.status;

        const update_data = {name, dni, birth_date, status};
        await Student.update(update_data, {where: {student_id}});
        request.flash('succes_msg', 'El registro se ha actualizado con exito');
        return response.redirect('/student/list');
    } catch (error) {
        console.error('Error al actualizar el registro', error.message);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un erorr al actualizar el registro');
        return response.redirect('/student/list');
    }
};

// ------------------ Controlador de eliminación ------------------
module.exports.delete_student = async (request, response) => {
    const student_id = request.params.student_id;

    try {
        const student = await Student.findByPk(student_id);

        if (!student) {
            request.flash('error_msg', 'El registro no existe');
            return response.redirect('/student/list');
        }

        await student.destroy();

        request.flash('success_msg', 'El registro se ha eliminado con exito');
        return response.redirect('/student/list');
    } catch (error) {
        console.error('errro al eliminar el registro', error.message);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un error al eliminar el registro');
        return response.redirect('/student/list');
    }
};