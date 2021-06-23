const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const incidenceSchema = new Schema({
    date: { type: Date, required: true },
    client: [{ type: mongoose.Types.ObjectId, ref: 'clients' }],
    problemType: { type: String, required: true },
    problemDesc: { type: String, required: true },
    leaveMaterial: { type: Boolean },
    leaveMaterialDesc: { type: String },
    image: { type: String, required: true },
    finished: { type: Boolean },
    estimatedEnd: { type: Date, required: true },
    asignedTo: { type: String, required: true }
}, { timestamps: true });

const Incidence = mongoose.model('Incidende', incidenceSchema);
module.exports = Incidence;