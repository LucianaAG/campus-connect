const express = require('express');
const router = express.Router();
const student_controllers = require('../controllers/student_controller');
const {ensure_authenticated} = require('../middlewares/authentication');

router.get('/', (req, res) => {
    res.redirect('/student/register');
});

// ------------------ Rutas de registro ------------------
router.get('/register', student_controllers.render_student_register_form);
router.post('/register', student_controllers.student_register_form);

// ------------------ Ruta de listado ------------------
router.get('/list', student_controllers.list_students);

// ------------------ Rutas de edición ------------------
router.get('/edit/:student_id', ensure_authenticated, student_controllers.render_student_edit_form);
router.post('/edit/:student_id', ensure_authenticated, student_controllers.student_edit_form);

// ------------------ Ruta de eliminación ------------------
router.post('/delete/:student_id', ensure_authenticated, student_controllers.delete_student);

module.exports = router;