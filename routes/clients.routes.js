const express = require('express');
const router = express.Router();
const Client = require('./../models/Client.model');
const { upload, uploadToCloudinary } = require('../middlewares/file.middleware');

router.get('/', async(req, res, next) => {
    try {
        const clients = await Client.find();
        return res.status(200).render('clients', { title: 'Clientes', clients: clients });
    } catch (error) {
        return next(error);
    }
});

router.get('/add-client', async(req, res, next) => {
    return res.status(200).render('add-client');
});

router.post('/add-client', [upload.single('logoCompany'), uploadToCloudinary], async(req, res, next) => {
    try {
        const { companyName, name, lastName, email, phone, address, cif } = req.body;

        const logoCompany = req.fileUrl ? req.fileUrl : '';

        const newClient = new Client({ companyName, name, lastName, email, phone, address, cif, logoCompany });

        await newClient.save();

        return res.status(201).redirect('/clients');

    } catch (error) {
        return next(error);
    }

});

router.get('/edit/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const client = await Client.findById(id);
        return res.status(200).render('edit-client', { client });
    } catch (error) {
        return next(error);
    }

});

router.put('/edit/:id', async(req, res, next) => {
    console.log('entro a editar');
    try {
        const id = req.params.id;

        const { name, lastName, companyName, email, phone, address, logoCompany, cif } = req.body;

        const editClient = { name, lastName, companyName, email, phone, address, logoCompany, cif };

        await Client.findByIdAndUpdate(id, editClient, { new: true });

        return res.redirect('/clients'); // no me va este redirect
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async(req, res, next) => {
    try {
        const id = req.params;
        console.log('borramos esta id -->', id.id);

        const deleted = await Client.findByIdAndDelete(id.id);
        if (deleted) {
            response = 'Client deleted fom db';
        } else {
            response = 'Client not deleted';
        }

        return res.status(200).redirect('/clients');
    } catch (error) {
        next(error);
    }

})

// router.create('/add-client', async(req, res, next) => {

// });

module.exports = router;