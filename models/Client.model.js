const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    logoCompany: { type: String },
    cif: { type: String, required: true },
}, { timestamps: true });

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;