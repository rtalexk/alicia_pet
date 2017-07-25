const app = require('../server');

let server = require('http').Server(app);
let io = require('socket.io')(server);
let socket;

let port = normalizePort(process.env.PORT || 3000);

server.listen(port);
console.log('server listening on port ' + port);

io.on('connection', skt => {
    console.log('user connected');

    skt.emit('news', { msg: 'hello world' });

    socket = skt;
});

function normalizePort(val) {
    let port = parseInt(val, 10);

    if (isNaN(port)) return val;
    if (port > 0) return port;
    return false;
}

module.exports = {
    getSocket: function() {
        return socket;
    }
};