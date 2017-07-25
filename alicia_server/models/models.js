const mongoose = require('mongoose');
const _ = require('underscore');

module.exports = (wagner) => {
    mongoose.Promise = global.Promise;
    mongoose.connect('mongodb://localhost:27017/alicia');

    wagner.factory('db', () => mongoose);

    let Record = require('./record.model');
    let Device = require('./device.model');

    wagner.factory('Record', () => Record);
    wagner.factory('Device', () => Device);
};