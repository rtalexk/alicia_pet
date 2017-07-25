const router = require('express').Router();

module.exports = (wagner) => {

    const deviceController = require('../controllers/device.controller')(wagner.invoke((Device) => Device));

    router.get('/', (req, res) => 
        deviceController.getRegistrationArray(req, res));

    router.post('/', (req, res) => 
        deviceController.create(req, res));

    return router;
};