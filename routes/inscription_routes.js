const express = require('express');
const router = express.Router();
const inscription_controllers = require('../controllers/inscription_controller');
const {ensure_authenticated} = require('../middlewares/authentication');

router.get('/', (req, res) => {
    res.redirect('/inscription/register');
});

// ------------------ Rutas de registro ------------------
router.get('/register', ensure_authenticated, inscription_controllers.render_inscription_register_form);
router.post('/register', ensure_authenticated, inscription_controllers.inscription_register_form);

// ------------------ Rutas de listado ------------------
router.get('/list', ensure_authenticated, inscription_controllers.inscriptions_list);

// ------------------ Rutas de registro ------------------
router.get('/edit/:inscription_id', ensure_authenticated, inscription_controllers.render_inscription_edit_form);
router.post('/edit/:inscription_id', ensure_authenticated, inscription_controllers.inscription_edit_form);

// ------------------ Rutas de elimianción ------------------
router.post('/delete/:inscription_id', ensure_authenticated, inscription_controllers.delete_inscription);

module.exports = router;