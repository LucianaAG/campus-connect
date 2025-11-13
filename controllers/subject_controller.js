const {validationResult} = require('express-validator');
const Subject = require('../models/subject_model');
const Teacher = require('../models/teacher_model');

// -------------------------------------------------------- ADMIN SESSION CONTROLLERS ---------------------------------------------------------------------------

// ------------------ Controlador de renderizado ------------------

module.exports.render_subject_register_form = async (request, response) => {
    try {
        const teachers = await Teacher.findAll({
            order: [['name', 'ASC']],
            raw: true
        });

        return response.render('subject/register', {teachers});
    } catch (error) {
        console.error('error al cargar categorías:', error.message);
        request.flash('error_msg', 'no se pudieron cargar las categorías');
        return response.redirect('/');
    }
};

// ------------------ Controlador de registro ------------------
module.exports.subject_register_form = async (request, response) => {
    const name = request.body.name;
    const code = request.body.code;
    const maximum_capacity = request.body.maximum_capacity;
    const minimum_capacity = request.body.minimum_capacity;
    const start_time = request.body.start_time;
    const end_time = request.body.end_time;
    const teacher_id = request.body.teacher_id;
    const code_exist = await Subject.findOne({where: {code}});

    if (code_exist) {
        request.flash('error_msg', 'Ya existe una matería con ese codigo.');
        return response.redirect('/subject/register');
    }

    try {
        const new_subject = await Subject.create({
            name,
            code,
            maximum_capacity,
            minimum_capacity,
            start_time,
            end_time,
            teacher_id
        });
        console.log('Nueva materia registrada', new_subject.toJSON());
        request.flash('success_msg', 'La materia se ha registrado con exito');
        return response.redirect('/subject/register');
    } catch (error) {
        console.log('Error al registrar la materia', error);
        request.flash('error_msg', 'Ocurrió un error al registrar la materia')
        return response.redirect('/subject/register');
    }
};

// ------------------ Controlador de listado ------------------
module.exports.list_subjects = async (request, response) => {
    try {
        const subjects = await Subject.findAll({raw: true});
        return response.render('subject/list', {subjects});
    } catch (error) {
        console.log('Error al listar los registros', error);
        request.flash('error_msg', 'Ocurrió un error al listar los registros');
        return response.redirect('/home');
    }
};

// ------------------ Controlador para renderizar form de modificacion ------------------
module.exports.render_edit_subject_form = async (request, response) => {
    try {
        const subject_id = request.params.subject_id;
        const subject_data = await Subject.findByPk(subject_id, {raw: true});

        if (!subject_data) {
            request.flash('error_msg', 'No se ha encontrado el registro');
            return response.redirect('/subject/list');
        }

        // Cargar las categorías
        const teachers = await Teacher.findAll({ order: [['name', 'ASC']], raw: true });

        return response.render('subject/edit', {
            subject: subject_data,
            subject_id: subject_id,
            teachers // ahora la vista recibe categories
        });
    } catch (error) {
        console.log("Error al obtener el registro", error.message);
        request.flash("error_msg", "Ocurrió un error al obtener el producto");
        return response.redirect("/subject/list");
    }
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
                    minimum_capacity: request.body.minimum_capacity,
                    start_time,
                    end_time,
                    teacher_id: request.body.teacher_id
                }
            }
        );
    }

    try {
        const subject_id = request.params.subject_id;
        const name = request.body.name;
        const code = request.body.code;
        const maximum_capacity = request.body.maximum_capacity;
        const minimum_capacity = request.body.minimum_capacity;
        const start_time = request.body.start_time;
        const end_time = request.body.end_time;
        const teacher_id = request.body.teacher_id;

        const subject_update_data = {name, code, maximum_capacity, minimum_capacity, start_time, end_time, teacher_id: teacher_id};
        await Subject.update(subject_update_data, {where: {subject_id}});
        request.flash('success_msg', 'La materia se ha actualizado con exito');
        return response.redirect('/subject/list');

    } catch (error) {
        console.error('Error al actualizar el registro', error);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un error al actualizar el registro');
        return response.redirect('/subject/list');
    }
};

// ------------------ Controlador de eliminación ------------------
module.exports.delete_subject = async (request, response) => {
        const subject_id = request.params.subject_id;
    try {
        const subject = await Subject.findByPk(subject_id);

        if (!subject) {
            request.flash('error_msg', 'El registro no existe');
            return response.redirect('/subject/list');
        }
        await subject.destroy();

        request.flash('success_msg', 'El registro se ha eliminado con exito');
        return response.redirect('/subject/list');
    } catch (error) {
        console.error('error al eliminar el registro', error.message);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un error al eliminar el registro');
        return response.redirect('/subject/list');
    }
};

