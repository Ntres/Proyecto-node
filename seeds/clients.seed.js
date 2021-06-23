const mongoose = require('mongoose');
const Client = require('../models/Client.model');
const db = require('../db');

const clientsSeed = [{
        name: 'Paco',
        lastName: 'Gonzalez',
        companyName: 'Recambios Gonzalez',
        email: 'paco@recambiosgonzales.com',
        phone: '+34678876587',
        address: 'C/ Falsa 123',
        cif: 'B123123123',
        logoCompany: 'https://colosocbd.com/wp-content/uploads/2021/03/coloso-cbd-logo-footer.png'
    },
    {
        name: 'Ana',
        lastName: 'Lopez',
        companyName: 'Ingenieria Lopez',
        email: 'ana@ingenieriaLopez.com',
        phone: '+34678326587',
        address: 'C/ Falsa 3',
        cif: 'B127723123',
        logoCompany: 'https://5sv.net/wp-content/uploads/2020/09/5SV-LOGO.svg'
    },
    {
        name: 'Fernando',
        lastName: 'Zapatero',
        companyName: 'Pezcados Fernando',
        email: 'info@pezcadosfernando.com',
        phone: '+34678876727',
        address: 'C/ Falsa 22',
        cif: 'B123123199',
        logoCompany: 'https://hoppymetal.com/wp-content/uploads/2020/04/PNGlogo_hoppy.png'
    },
    {
        name: 'Carla',
        lastName: 'Martinez',
        companyName: 'Interiores Martinez',
        email: 'carla@interioresmartinez.com',
        phone: '+34612345678',
        address: 'C/ Falsa 1',
        cif: 'B123123188',
        logoCompany: 'https://colosocbd.com/wp-content/uploads/2021/03/coloso-cbd-logo-footer.png'
    },
];

mongoose
    .connect(db.URL_DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async() => {
        console.log('Introduciendo datos de clientes desde el seed');

        const allClients = await Client.find()

        if (allClients.length) {
            await Client.collection.drop()
            console.log('Se ha eliminado la colección correctamente');
        }
    })
    .then(async() => {
        await Client.insertMany(clientsSeed);
        console.log('Agregados clientes correctamente');
    })
    .catch((error) => {
        console.log('Error al ejecutar el seed --> ', error);
    })
    .finally(() => { mongoose.disconnect() })