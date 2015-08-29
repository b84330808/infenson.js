var fs = require('fs');
var routePairs = {
	'/'						: '/index.html',
	'/menu.css'				: '/public/menu.css',
	'/index.css'			: '/public/index.css',
	'/terminal.css'			: '/public/terminal.css',
	'/index.js'				: '/public/index.js',
	'/hotkeys.js'				: '/public/hotkeys.js',
	'/terminal.js'			: '/node_modules/terminal.js/dist/terminal.js',
	'/socket.io-stream.js'	: '/node_modules/socket.io-stream/socket.io-stream.js'
};

/* new */
module.exports = function(req, res) {
	if(routePairs[req.url] != undefined){
		fs.createReadStream('.' + routePairs[req.url]).pipe(res);
	}
	else{
		res.writeHead(404, {
		    'Content-Type': 'text/plain'
		});
		res.end('404 Not Found');
	}
}

/* old function */

// module.exports = function(req, res) {
//     var file = null;

//     switch (req.url) {
//         case '/':
//         case '/index.html':
//             file = '/index.html';
//             break;
//         case '/terminal.js':
//             file = '/node_modules/terminal.js/dist/terminal.js';
//             break;
//         case '/socket.io-stream.js':
//             file = '/node_modules/socket.io-stream/socket.io-stream.js';
//             break;
//         default:
//             res.writeHead(404, {
//                 'Content-Type': 'text/plain'
//             });
//             res.end('404 Not Found');
//             return;
//     }

//     fs.createReadStream('.' + file).pipe(res);
// }