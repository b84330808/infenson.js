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

/* ptys manager */
var ptyMan = {};

/* socket server for terminal control */
/* on connected */
socketio(server).of('termctl').on('connection', function(socket) {
    /* receives a message for new bash child process */
    ss(socket).on('new', function(stream, name) {
        /* start a new bash child process */
        var newPty = gy.spawn('bash', [], {
            // name: '',
            cols: 80,
            rows: 30,
            cwd: process.env.HOME,
            env: process.env
        });
        newPty.resize(50,24);

        /* connect the bidirectional pipe from front-end */
        newPty.stdout.pipe(stream).pipe(newPty.stdin);

        /**/
        ptyMan[name] = {
            obj: newPty
        };

        /* if one socket disconnected, kill the spawned bash */
        socket.on('disconnect', function() {
            newPty.kill('SIGHUP');
            delete ptyMan[name];
        });
    });

    /* receives a message of remove one terminal, kill the spawned bash */
    socket.on('remove', function(name) {
        ptyMan[name].obj.kill('SIGHUP');
        delete ptyMan[name];
    });

    /**/
    socket.on('hello', function() {
        console.log(ptyMan);
    });
});

/* if end process, kill all spawned terminals */
process.on('exit', function() {
    var keys = Object.keys(ptyMan);

    for (var i in keys) {
        ptyMan[i].obj.kill('SIGHUP');
        delete ptyMan[i];
    }
});

console.log('Running on port:' + config.port);