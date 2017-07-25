const router = require('express').Router();

module.exports = (wagner) => {

    const deviceController = require('../controllers/device.controller')(wagner.invoke((Device) => Device));

    router.post('/', (req, res) => 
        deviceController.create(req, res));

    return router;
};
