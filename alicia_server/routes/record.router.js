const router = require('express').Router();

module.exports = (wagner) => {

    const recordController = require('../controllers/record.controller')(wagner.invoke((Record) => Record));

    router.get('/all', (req, res) => 
        recordController.getAll(req, res));

    router.get('/', (req, res) => 
        recordController.getCurrent(req, res));

    router.post('/', (req, res) => 
        recordController.create(req, res));

    return router;
};