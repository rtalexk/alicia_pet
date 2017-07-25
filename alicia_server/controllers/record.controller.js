const s = require('http-status');
const FCM = require('fcm-node');
const fs = require('fs');
const SERVER_KEY = 'AAAAOdNpi2c:APA91bEkcadEWC9cJvOBKAWVngM_XewPiWjuqQ3jMKOKCFl_w13ndPVqrDoBvqg4KLGFKeOD0t92guH63gQTCYZBJE6Rqrroi4ySCPo6_wzNAnOvrLM0h3a_daq0xLK4vnB4r59yPD7G';
const ROOT_VIDEO = 'http://localhost:3000/videos';

const fcm = new FCM(SERVER_KEY);

const Device = require('../models/device.model');

module.exports = (Record) => {

    let getAll = (req, res) => {
        Record.find({}).sort({ date: -1 }).exec((err, records) => {
            if (err) {
                return res.status(s.INTERNAL_SERVER_ERROR).json({
                    error: err.toString()
                });
            }
            res.json({ records: records });
        });
    };

    let getCurrent = (req, res) => {
        let currentDate = new Date();
        let year = req.query.year || currentDate.getFullYear();
        let month = req.query.month || currentDate.getMonth();
        let day = req.query.day || currentDate.getDate();

        let query = [{ $match: { year: year, month: month, day: day } }];

        let type = req.query.type || 'current';
        if (type !== 'avg' && type !== 'current')
            type = 'current';

        if (type === 'current') {
            query = query.concat([
                { $sort: { date: -1 } },
                { $limit: 1 },
                {
                    $project: {
                        date: 1,
                        food: 1,
                        water: 1,
                        gas: 1
                    }
                }
            ]);
        } else {
            query = query.concat([{
                $group: {
                    _id: { year: '$year', month: '$month', day: '$day' },
                    avgFood: { $avg: '$food' },
                    avgWater: { $avg: '$water' },
                    avgGas: { $avg: '$gas' }
                }
            }]);
        }

        Record.aggregate(query).exec((err, record) => {
            if (err) {
                res.status(s.INTERNAL_SERVER_ERROR).json({
                    error: err.toString()
                });
            }
            res.json({ record: record[0] });
        });
    };

    let create = (req, res) => {
        let { sec, min, hour, day, month, year } = req.body;
        let { water, food, gas, temperature, presence } = req.body;
        let date = new Date(year, month, day, hour, min, sec);
        let { getSocket } = require('../bin/index');

        const socket = getSocket();

        Record.create({
            year: year, month: month, day: day,
            hour: hour, min: min, sec: sec,
            water: water, food: food, gas: gas,
            temperature: temperature, presence: presence,
            date: date
        }).then(created => {
            if (socket) {
                socket.emit('new record', { record: created });
                console.log('data emited');
            } else {
                console.log('data NOT emited');
            }
            handleUserNotification(created);
            res.json({ record: created });
        }).catch(err => {
            return res.status(s.INTERNAL_SERVER_ERROR).json({
                error: err.toString()
            });
        });
    };

    return ({
        getAll,
        getCurrent,
        create
    });
};


function handleUserNotification(record) {

    let new_date = new Date();

    blockNotifications(new_date, (err, res) => {
        if (err) {
            console.log(err);
            return;
        }

        if (res) {
            return;
        }


        console.log('handleNotification');
        let msg = {
            to: 'registration_token',
            collapse_key: 'your_collapse_key',
            notification: {
                title: '¡Alerta de consumibles!',
                body: ''
            }
        };

        let consumibles = [];
        let message = '';
        let gas = '';

        if (record.water < 15) {
            consumibles.push('agua');
        }
        if (record.food < 15) {
            consumibles.push('comida');
        }
        if (record.gas) {
            gas = '¡Alerta de gas!';
        }

        if (consumibles.length) {
            message = 'Atención, ' + consumibles.join(', ') + ' está(n) por agotarse. ';
        }

        if (message || gas) {
            message += gas;
        } else {
            return;
        }

        msg.notification.body = message;

        getRegistrationArray((err, devices) => {
			if (!devies) {
				console.log('not device to notify');
				return;
			}
            devices.ids.map(item => {
                msg.to = item;
                fcm.send(msg, (err, res) => {
                    if (err) {
                        console.log('error sendind msj: ' + err);
                    } else {
                        console.log('message sent: ' + !!res.success);
                        fs.writeFileSync(__dirname + '/../last_notif.txt', new Date());
                    }
                });
            });
        });
    });
}

function getRegistrationArray(cb) {
    Device.aggregate([
        { $match: { type: 'device' } },
        { $group: { _id: { type: '$type' }, ids: { $push: '$registrationId' } } }
    ]).exec((err, devices) => {
        if (err) cb(err, null);
        else cb(null, devices[0]);
    });
};

function blockNotifications(new_date, cb) {
    return fs.readFile(__dirname + '/../last_notif.txt', 'UTF-8', (err, data) => {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        try {
            var old_date = new Date(data);
        } catch (err) {
            console.log(err);
            cb(err, false);
        }

        let diff;
        if (old_date < new_date) {
            diff = new_date - old_date;
        } else {
            diff = old_date - new_date;
        }

        const reff = 5 * 60 * 1000;

        if (diff < reff) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    });
}
