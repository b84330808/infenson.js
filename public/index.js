/* terminal number list */
var termNums = [];
for(var i = 0; i < 10; i++){
    termNums.push(false);
}
/* terminals manager */
var termMan = {};
var c= '';

/* socket for terminal control */
var socket = io(location.origin + '/termctl');
/* auto create one terminal (default) */
createNewTerminal();

/* create a new ternimal */
function createNewTerminal(){
    /* get a idle number from terminal number list */
    var tid = undefined;
    for(var i = 0; i < 10; i++){
        if(!termNums[i]){
            termNums[i] = true;
            tid = i;
            break;
        }
    }
    /* if get */
    if(tid != undefined){
        /* create new tag on DOM */
        var newTerm = document.createElement('pre');
        newTerm.setAttribute('id', 'term' + tid);
        newTerm.setAttribute('class', 'terminal');
        newTerm.setAttribute('data-columns', '80');
        newTerm.setAttribute('data-rows', '30');
        newTerm.setAttribute('ondblclick', 'removeTerminal(this.id);');
        /* create new terminal object */
        var term = new Terminal(newTerm.dataset);    
        /* create bidirectional stream */
        var stream = ss.createStream({
            decodeStrings: false,
            encoding: 'utf-8'
        });
        /* send message to local server for setting up new bash child process */
        ss(socket).emit('new', stream, 'term' + tid);
        /* connect stream pipe */
        stream.pipe(term).dom(newTerm).pipe(stream);

        /* append the new terminal object to container */
        document.getElementById('container').appendChild(newTerm);

        // .on('data', function (data) {
        //     if(data == '\r\n'){
        //         if(c.length != 0){
        //             alert(c);
        //             c ='';
        //         }
        //     }
        //     else if(data.length == 1){
        //         c += data;
        //     }
        // });

        /*  */
        termMan['term' + tid] = {
            obj: newTerm,
            stream: stream
        };
    }
    else{
        alert('Can\'t create more!');
    }
}

function removeTerminal(termName){
    document.getElementById('container').removeChild(termMan[termName].obj);
    termNums[parseInt(termName[4])] = false;
    delete termMan[termName];
    socket.emit('remove', termName);
}

/* old codes */

// var containers = document.getElementsByClassName('terminal');
// var socket = io(location.origin + '/termctl');

// for (var i = 0; i < containers.length; i++) {
//     var term = new Terminal(containers[i].dataset);
//     var stream = ss.createStream({
//         decodeStrings: false,
//         encoding: 'utf-8'
//     });
//     ss(socket).emit('new', stream, containers[i].dataset);
//     stream.pipe(term).dom(containers[i]).pipe(stream);
// }