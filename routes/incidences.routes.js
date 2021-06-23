const express = require('express');
const router = express.Router();
const Incidence = require('./../models/Incidence.model');
const { upload, uploadToCloudinary } = require('../middlewares/file.middleware');

router.get('/', async(req, res, next) => {
    let formatedIncidences = [];
    try {
        const incidences = await Incidence.find().lean();

        incidences.forEach(element => {
            let newElement = {...element };
            newElement.date = formatDate(element.date);
            newElement.estimatedEnd = formatDate(element.estimatedEnd);
            formatedIncidences.push(newElement);
        });

        return res.status(200).render('incidences', { title: 'Incidencias', incidences: formatedIncidences });
    } catch (error) {
        return next(error);
    }
});

router.get('/add-incidence', async(req, res, next) => {
    return res.status(200).render('add-incidence');
});

router.post('/add-incidence', [upload.single('image'), uploadToCloudinary], async(req, res, next) => {
    try {
        let {
            date,
            client,
            problemType,
            problemDesc,
            leaveMaterial,
            leaveMaterialDesc,
            finished,
            estimatedEnd,
            asignedTo
        } = req.body;

        const image = req.fileUrl ? req.fileUrl : '';

        if (!leaveMaterial) {
            leaveMaterial = false;
        }

        if (!finished) {
            finished = false;
        }

        const newIncidence = new Incidence({
            date,
            client,
            problemType,
            problemDesc,
            leaveMaterial,
            leaveMaterialDesc,
            image,
            finished,
            estimatedEnd,
            asignedTo
        });

        await newIncidence.save();

        return res.status(201).redirect('/incidences');
    } catch (error) {
        return next(error);
    }

});


function formatDate(date) {
    var d = new Date(date),
        day = '' + d.getDate(),
        month = '' + (d.getMonth() + 1),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [day, month, year].join('/');
}

module.exports = router;