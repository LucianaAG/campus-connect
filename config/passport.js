const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user'); // modelo

module.exports = function (passport) {

  // Estrategia local (login con email y contraseña)
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ where: { email } });

          if (!user) {
            return done(null, false, { message: 'Email no registrado' });
          }

          const validPassword = await bcrypt.compare(password, user.password);

          if (!validPassword) {
            return done(null, false, { message: 'Contraseña incorrecta' });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  // Guardar usuario en sesión
  passport.serializeUser((user, done) => {
    done(null, user.user_id);
  });

  // Recuperar usuario de sesión
  passport.deserializeUser(async (user_id, done) => {
    try {
      const user = await User.findByPk(user_id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};