const express = require('express');
const router = express.Router();
const subject_controllers = require('../controllers/subject_controller');
const {ensure_authenticated} = require('../middlewares/authentication');

// ------------------ Ruta de redireccionamiento ------------------
router.get('/', (req, res) => {
    res.redirect('/subject/register');
});

// ------------------ Rutas de registro ------------------
router.get('/register', ensure_authenticated, subject_controllers.render_subject_register_form);
router.post('/register', ensure_authenticated, subject_controllers.subject_register_form);

// ------------------ Rutas de listado ------------------
router.get('/list', ensure_authenticated, subject_controllers.list_subjects);

// ------------------ Rutas de modificacion y eliminacion ------------------
router.get('/edit/:subject_id', ensure_authenticated, subject_controllers.render_edit_subject_form);
router.post('/edit/:subject_id', ensure_authenticated, subject_controllers.edit_subject_form);
router.post('/delete/:subject_id', ensure_authenticated, subject_controllers.delete_subject);

module.exports = router;