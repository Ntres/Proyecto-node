const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/User.model');

passport.serializeUser((user, done) => {
    return done(null, user._id);
});

passport.deserializeUser(async(userId, done) => {
    try {
        const existingUser = await User.findById(userId);

        return done(null, existingUser);
    } catch (error) {
        return done(error, null);
    }
});

/**
 * Devuelve true si es válido el email, false en caso contrario
 */
const isValidEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

/**
 * Devuelve true si es válida la contraseña, false en caso contrario
 * mínimo 8 carácteres y un número
 */
const isValidPassword = (password) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    return re.test(String(password));
};

/**
 * Creamos la estrategia de LOGIN
 */
const loginStrategy = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
    },
    async(req, email, password, done) => {

        try {
            const { email, username } = req.body;
            let existingUser = null;

            if (email) {
                existingUser = await User.findOne({ email });
            }

            if (username) {
                existingUser = await User.findOne({ username });
            }

            if (!existingUser)  {
                const error = new Error('El usuario no existe');
                error.status = 401;
                return done(error, null);
            }

            const isValidPassword = await bcrypt.compare(password, existingUser.password);

            if (!isValidPassword) {
                const error = new Error('Contraseña no es válida!');
                return done(error, null);
            }
            console.log(existingUser);
            existingUser.password = null;
            return done(null, existingUser);

        } catch (error) {
            console.log('Error en la estrategia de login en passport.js', error);
            return done(error, null);
        }
    }
);

const registerStrategy = new LocalStrategy({
        usernameField: 'email', // nombre del campo de nuestro modelo que usaremos para autenticar -> req.body.email
        passwordField: 'password', // nombre del campo de nuestro modelo que usaremos para la contraseña -> req.body.password
        passReqToCallback: true,
    },

    async(req, email, password, done) => {

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                const error = new Error('El usuario ya existe');
                return done(error, null);
            }

            if (!isValidEmail(email)) {
                const error = new Error('Email no válido');
                return done(error, null);
            }

            if (!isValidPassword(password)) {
                const error = new Error('Contraseña inválida');
                return done(error, null);
            }

            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);

            const newUser = new User({
                email: email,
                password: passwordHash, // Ahora cambiamos esto y hasheamos.
                name: req.body.name,
                lastName: req.body.lastName,
                username: req.body.username,
            });

            const savedUser = await newUser.save();

            savedUser.password = null;
            return done(null, savedUser);

        } catch (error) {
            return done(error, null);
        }
    }
);


passport.use('register', registerStrategy);
passport.use('login', loginStrategy);