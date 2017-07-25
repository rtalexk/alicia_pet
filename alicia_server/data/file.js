let fs = require('fs');

function writeFile() {
    fs.writeFile(__dirname + '/../last_notif.txt', new Date(), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log('file created');
        }
    });
}

function blockNotifications(new_date, cb) {
    return fs.readFile(__dirname + '/../last_notif.txt', 'UTF-8', (err, data) => {
        if (err) {
            console.log(err);
            return cb(err, false);
        }
        try {
            var old_date = new Date(data);
        } catch(err) {
            console.log(err);
            cb(err,false);
        }

        let diff;
        if (old_date < new_date) {
            diff = new_date - old_date;
        } else {
            diff = old_date - new_date;
        }

        const reff = 5 * 60 * 1000;

        console.log(getJustTime(old_date), getJustTime(new_date));
        console.log('diff:', diff);
        console.log('reff:', reff);

        if (diff < reff) {
            cb(null, true);
        } else {
            cb(null, false);
        }
    });
}

function getJustTime(date) {
    return (date + '').split(' ')[4];
}

blockNotifications(new Date(), (err, res) => {
    if (err) throw error;
    console.log(res);
})