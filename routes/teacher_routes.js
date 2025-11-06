const express = require('express');
const router = express.Router();
const teacher_controllers = require('../controllers/teacher_controller');

// ------------------ Ruta de redireccionamiento ------------------
router.get('/', (req, res) => {
    res.redirect('/teacher/register');
});

// ------------------ Rutas de registro ------------------
router.get('/register', teacher_controllers.render_register_teacher_form);
router.post('/register', teacher_controllers.register_teacher_form);

// ------------------ Ruta de listado ------------------
router.get('/list', teacher_controllers.list_teachers);

// ------------------ Rutas de edición y eliminación ------------------
router.get('/edit/:teacher_id', teacher_controllers.render_edit_teacher_form);
router.post('/edit/:teacher_id', teacher_controllers.edit_teacher_form);
router.get('/delete/:teacher_id', teacher_controllers.delete_teacher);

module.exports = router;