const {validationResult} = require('express-validator');
const {Subject, Inscription, Student, Teacher} = require('../models/associations');

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

        return response.render('inscription/register', {subjects, students});
    } catch (error) {
        console.error('error al cargar materias y estudiantes:', error.message);
        request.flash('error_msg', 'no se pudieron cargar las materias y estudiantes');
        return response.redirect('/');
    }
};

// ------------------ Controlador de registro ------------------
module.exports.inscription_register_form = async (request, response) => {
    const subject_id = request.body.subject_id;
    const student_id = request.body.student_id;
    const inscription_date = request.body.inscription_date;

    // Evaluar que las materias a las que esta inscripto el alumno actual, no se interpongan con el horario de la materia a inscribi


    try {
        const subject = await Subject.findByPk(subject_id);
        const exist_prior_inscriptions = await Inscription.findAll({
            where: {student_id},
            include: [{model: Subject}]
        });

        let conflict = false;

        for (let ins of exist_prior_inscriptions) {
            const existing = ins.subject;

            if (existing.start_time < subject.end_time && 
                subject.start_time < existing.end_time) {
                conflict = true;
                break;
            }
        };

        if (conflict) {
            request.flash('error_msg', 'La matería seleccionada tiene un conflicto de horarios.')
            return response.redirect('/inscription/register');
        };

        const new_inscription = await Inscription.create({
            subject_id,
            student_id,
            inscription_date
        });
        console.log('Nueva inscripción registrada', new_inscription.toJSON());
        request.flash('success_msg', 'La inscripción se ha registrado con exito');
        return response.redirect('/inscription/register');

    } catch (error) {
        console.log('Error al registrar la inscripción', error);
        request.flash('error_msg', 'Ocurrió un error al registrar la inscripción')
        return response.redirect('/inscription/register');
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
        return response.redirect('/home');
    }
};

module.exports.render_inscription_edit_form = async (request, response) => {
    try {
        const inscription_id = request.params.inscription_id;
        const inscription_data = await Inscription.findByPk(inscription_id, { raw: true });

        if (!inscription_data) {
            request.flash('error_msg', 'No se encontró la inscripción');
            return response.redirect('/inscription/list');
        }

        const subjects = await Subject.findAll({
            order: [['name', 'ASC']],
            raw: true
        });

        const students = await Student.findAll({
            order: [['name', 'ASC']],
            raw: true
        });

        return response.render('inscription/edit', {
            inscription: inscription_data,
            subjects,
            students
        });

    } catch (error) {
        console.error('Error al cargar la inscripción:', error.message);
        request.flash('error_msg', 'No se pudo cargar la inscripción');
        return response.redirect('/inscription/list');
    }
};

module.exports.inscription_edit_form = async (request, response) => {
    const errors = validationResult(request);
    const inscription_id = request.params.inscription_id;

    if (!errors.isEmpty()) {
        return response.render('/inscription/edit',
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
        request.flash('success_msg', 'El registro se ha actualizado con exito');
        return response.redirect('/inscription/list');
    } catch (error) {
        console.error('Error al actualizar el registro', error.message);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un erorr al actualizar el registro');
        return response.redirect('/inscription/list');
    }
};

// ------------------ Controlador de eliminación ------------------
module.exports.delete_inscription = async (request, response) => {
     const inscription_id = request.params.inscription_id;

    try {
        const inscription = await Inscription.findByPk(inscription_id);

        if (!inscription) {
            request.flash('error_msg', 'El registro no existe');
            return response.redirect('/inscription/list');
        }

        await inscription.destroy();

        request.flash('success_msg', 'El registro se ha eliminado con exito');
        return response.redirect('/inscription/list');
    } catch (error) {
        console.error('errro al eliminar el registro', error.message);

        if (error.parent) {
            console.error('Detalle SQL', error.parent.sqlMessage);
        }
        request.flash('error_msg', 'Ocurrió un error al eliminar el registro');
        return response.redirect('/inscription/list');
    }
};