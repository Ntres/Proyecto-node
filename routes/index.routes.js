const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    return res.status(200).render('index', { title: 'Dashboard', user: req.user });
});

module.exports = router;