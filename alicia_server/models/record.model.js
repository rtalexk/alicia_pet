const mongoose = require('mongoose');

let recordSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true },
    day: { type: Number, required: true },
    hour: { type: Number, required: true },
    min: { type: Number, required: true },
    sec: { type: Number, required: true },

    food: { type: Number, required: true, min: 0, max: 100 },
    water: { type: Number, required: true, min: 0, max: 100 },
    temperature: { type: Number, required: true },
    gas: { type: Boolean, required: true },
    presence: { type: Boolean, required: true }
});

let recordModel = mongoose.model('Record', recordSchema, 'records');
module.exports = recordModel;