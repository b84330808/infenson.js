/* modules */
var http = require('http'),
    socketio = require('socket.io'),
    gy = require('pty'),
    ss = require('socket.io-stream');

/* create server */
var config = require('./config.js');
var server = http.createServer().listen(config.port, config.interface); // only on localhost

/* routes */
var router = require('./router.js');
server.on('request', router);

/**/
var ptys = {};

/* socket server for terminal control */
/* on connected */
socketio(server).of('termctl').on('connection', function(socket) {
    // receives a bidirectional pipe from the client see index.html
    // for the client-side
    ss(socket).on('new', function(stream, options) {
        var name = options.name;

/////*****style******///////
        var pty = gy.spawn('bash', [], {
            name: '',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME,
            env: process.env
        });


        pty.stdout.pipe(stream).pipe(pty.stdin);
        ptys[name] = pty;

        /* if one socket disconnected, the spawned terminal */
        socket.on('disconnect', function() {
            pty.kill('SIGHUP');
            delete ptys[name];
        });
    });
});

/* if end process, kill all spawned terminals */
process.on('exit', function() {
    var k = Object.keys(ptys);
    var i;

    for (i = 0; i < k.length; i++) {
        ptys[k].kill('SIGHUP');
    }
});

console.log('Running on port:' + config.port);