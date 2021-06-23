const express = require('express');
const path = require('path');
const session = require('express-session'); // Se encarga de leer y escribir las sesiones
const MongoStore = require('connect-mongo'); // Guarda en base de datos las sesiones
const passport = require('passport'); // Gestiona nuestra autenticación (es nuestra empresa de seguridad)
require('./authentication/passport');

const isAuth = require('./middlewares/auth.middleware').isAuth;

const indexRoutes = require('./routes/index.routes');
const clientsRoutes = require('./routes/clients.routes');
const incidencesRoutes = require('./routes/incidences.routes');
const authRotes = require('./routes/auth.routes.js');


const db = require('./db');

db.connect();

const PORT = 3000;
const app = express();


app.use(session({
    secret: 'asd!WQe!"3d.asd0/)12/3Adcq',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1 * 24 * 60 * 60 * 1000,
    },
    store: MongoStore.create({ mongoUrl: db.URL_DB }),
}));

app.use((req, res, next) => {
    req.isAdmin = true;
    next();
});

app.use(passport.initialize());
app.use(passport.session());


/**
 * Exponer carpeta public para acceder desde el navegador a todo lo que contenga
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Add views config
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', indexRoutes);
app.use('/auth', authRotes);
app.use(isAuth)
app.use('/clients', clientsRoutes);
app.use('/incidences', incidencesRoutes);

app.use('*', (req, res) => {
    const error = new Error('Ruta no encontrada');
    error.status = 404;

    return res.status(404).json(error);
});

app.use((error, req, res, next) => {
    console.log(error);

    return res.status(error.status || 500).render('error', {
        message: error.message || 'Unexpected error',
        status: error.status || 500,
    });
});



app.listen(PORT, () => {
    console.log('Server running in port', PORT);
});