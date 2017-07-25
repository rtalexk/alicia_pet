const s = require('http-status');

module.exports = (Device) => {

    let create = (req, res) => {
        let query = { registrationId: req.body.registrationId };
        Device.findOneAndUpdate(query, query, {
            upsert: true
        }, (err, device) => {
            if (err) {
                return res.status(s.INTERNAL_SERVER_ERROR).json({ error: err.toString() });
            }
            res.json({ device: device });
        });
    };

    return {
        create
    };

}