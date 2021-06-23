const express = require('express');
const router = express.Router();
const passport = require('passport');


router.get('/register', (req, res, next) => {
    return res.status(200).render('registerview', { title: 'Registro' });
});

router.post('/register', (req, res, next) => {
    const { email, username, name, password, list } = req.body;

    if (!email || !username || !name || !password) {
        const error = 'Completa todos los campos'
        return res.render('registerview', { error });
    }

    const done = (error, user) => {

        if (error) return next(error);

        const doneParaSerialize = (error, user) => {
            if (error) return next(error);
            return res.redirect('/');
        };

        req.logIn(user, doneParaSerialize);
    };

    passport.authenticate('register', done)(req);
});

router.get('/login', (req, res, next) => {
    return res.render('login');
});

router.post('/login', (req, res, next) => {
    /**
     * Callback que le pasamos a passport para saber si hay un error o no.
     */
    const done = (error, user) => {
        /**
         * Si hay error, despachamos la petición por el middleware de error.
         */
        if (error) return next(error);

        /**
         * Función callback que recibirá passport.serialize.
         */
        const doneParaSerialize = (error, user) => {
            /**
             * Si hay un problema creando la sesión del usuario en nuestro servidor
             * devolveremos el error.
             */
            if (error) {
                // error.status = 401;
                return next(error);
            };

            /**
             * Si el usuario es logueado correctamente, a continuación haremos con el
             * lo que queramos. En este caso, redirigirlo a Home.
             */
            return res.redirect('/');
        }

        /**
         * Función para autenticar al usuario en nuestro servidor y crear su sesión
         */
        req.logIn(user, doneParaSerialize);
    };

    passport.authenticate('login', done)(req);
});

router.post('/logout', (req, res, next) => {
    if (req.user) {
        req.logout();

        req.session.destroy(() => {
            res.clearCookie('connect.sid');
            return res.redirect('/');
        });
    } else {
        return res.status(200).json('No había usuario logueado');
    }
});

module.exports = router;