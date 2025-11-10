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

module.exports = router;