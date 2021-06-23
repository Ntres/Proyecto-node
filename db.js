const mongoose = require('mongoose');

const URL_DB = 'mongodb://localhost:27017/proyecto-node';

const connect = async() => {
    try {
        await mongoose.connect(URL_DB, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to BBDD');
    } catch (error) {
        console.log('Error to connect to BBDD, error info --> ', error)
    }
}

module.exports = {
    URL_DB,
    connect
}