const mongoose = require('mongoose');
const agent = require('superagent');

mongoose.Promise = global.Promise;

const Record = require('../models/record.model');

mongoose.connect('mongodb://localhost:27017/alicia', function(err) {
    if (err) throw err;
    // setInterval(createRecord, 5000);
    setInterval(postRecord, 5000);
});

function createRecord() {
    const record = randomRecord();
    Record.create(record)
        .then(created => console.log(created.date))
        .catch(err => console.log(err));
}

function postRecord() {
    const url = 'https://d5b64591.ngrok.io/api/record';
    const record = randomRecord();
    console.log(JSON.stringify(record));
    agent.post(url)
        .send(record)
        .end((err, res) => {
            if (err) console.log(err);
            console.log(res.body.record.date);
        });
}

function randomRecord() {
    const date = new Date();
    return ({
        date: date,
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDate(),
        hour: date.getHours(),
        min: date.getMinutes(),
        sec: date.getSeconds(),
        food: Math.ceil(Math.random() * 100),
        water: Math.ceil(Math.random() * 100),
        temperature: Math.ceil(Math.random() * 36),
        gas: randomBoolean(),
        presence: randomBoolean()
    });
}

function randomBoolean() {
    let num = Math.random() * 101;
    return num < 21;
}
