const express = require('express');
const router = express.Router();
const teacher_controllers = require('../controllers/teacher_controller');
const {ensure_authenticated} = require('../middlewares/authentication');

// ------------------ Ruta de redireccionamiento ------------------
router.get('/', (req, res) => {
    res.redirect('/teacher/register');
});

// ------------------ Rutas de registro ------------------
router.get('/register', ensure_authenticated, teacher_controllers.render_register_teacher_form);
router.post('/register', ensure_authenticated, teacher_controllers.register_teacher_form);

// ------------------ Ruta de listado ------------------
router.get('/list', ensure_authenticated, teacher_controllers.list_teachers);

// ------------------ Rutas de edición y eliminación ------------------
router.get('/edit/:teacher_id', ensure_authenticated, teacher_controllers.render_edit_teacher_form);
router.post('/edit/:teacher_id', ensure_authenticated, teacher_controllers.edit_teacher_form);
router.post('/delete/:teacher_id', ensure_authenticated, teacher_controllers.delete_teacher);

module.exports = router;