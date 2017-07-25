const mongoose = require('mongoose');

let deviceSchema = new mongoose.Schema({
    registrationId: { type: String, required: true },
    type: { type: String, default: 'device' }
});

let deviceModel = mongoose.model('Device', deviceSchema, 'devices');
module.exports = deviceModel;