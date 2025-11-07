const {validationResult} = require('express-validator');
const Subject = require('../models/subject_model');

// -------------------------------------------------------- ADMIN SESSION CONTROLLERS ---------------------------------------------------------------------------

// ------------------ Controlador de renderizado ------------------

module.exports.render_subject_register_form = async (request, response) => {
    response.render('subject/register');
};

// ------------------ Controlador de registro ------------------
module.exports.subject_register_form = async (request, response) => {
    const name = request.body.name;
    const code = request.body.code;
    const maximum_capacity = request.body.maximum_capacity;
    const minimum_capacity = request.body.minimum_capacity;

    try {
        const new_subject = await Subject.create({
            name,
            code,
            maximum_capacity,
            minimum_capacity
        });
        console.log('Nueva materia registrada', new_subject.toJSON());
        request.flash('success_msg', 'La materia se ha registrado con exito');
        response.redirect('/subject/register');
    } catch (error) {
        console.log('Error al registrar la materia', error);
        request.flash('error_msg', 'Ocurrió un error al registrar la materia')
        response.redirect('/subject/register');
    }
};

// ------------------ Controlador de listado ------------------
module.exports.list_subjects = async (request, response) => {
    try {
        const subjects = await Subject.findAll({raw: true});
        response.render('subject/list', {subjects});
    } catch (error) {
        console.log('Error al listar los registros', error);
        request.flash('error_msg', 'Ocurrió un error al listar los registros');
        response.redirect('/home');
    }
};

// ------------------ Controlador para renderizar form de modificacion ------------------
module.exports.render_edit_subject_form = async (request, response) => {
    response.render('subject/edit');
};

// ------------------ Controlador para actualizar los datos en la bd ------------------
module.exports.edit_subject_form = async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        response.render('subject/edit',
            {
                error: errors.array(),
                subject: {
                    name: request.body.name,
                    code: request.body.code,
                    maximum_capacity: request.body.maximum_capacity,
                    minimum_capacity: request.body.minimum_capacity
                }
            }
        );
    }

    try {
        const subject_id = request.params.teacher_id;
        const name = request.body.name;
        const code = request.body.code;
        const maximum_capacity = request.body.maximum_capacity;
        const minimum_capacity = request.body.minimum_capacity;

        const subject_update_data = {name, code, maximum_capacity, minimum_capacity};
        await Subject.update(subject_update_data, {where: {subject_id}});
        request.flash('succes_msg', 'La materia se ha actualizado con exito');
        response.redirect('/subject/list');

    } catch (error) {
        console.error('Error al actualizar el registro', error);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un error al actualizar el registro');
        response.redirect('/subject/list');
    }
};

// ------------------ Controlador de eliminación ------------------
module.exports.delete_subject = async (request, response) => {
    const subject_id = request.params.subject_id;
    try {
        await Subject.destroy({where: {subject_id}});
        request.flash('succes_msg', 'El registro se ha eliminado con exito');
        response.redirect('/subject/list');
    } catch (error) {
        console.error('errro al eliminar el registro', error.message);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un error al eliminar el registro');
        response.redirect('/subject/list');
    }
};

