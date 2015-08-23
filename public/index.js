/* terminal number list */
var termNums = [];
for(var i = 0; i < 10; i++){
    termNums.push(false);
}
/* terminals manager */
var termMan = {};

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
        newTerm.setAttribute('data-columns', '50');
        newTerm.setAttribute('data-rows', '24');
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
        var newCloseBtn = document.createElement('a');
        newCloseBtn.setAttribute('class', 'close-button');
        newCloseBtn.setAttribute('href', 'javascript:removeTerminal(\'term' + tid + '\')');
        newCloseBtn.innerHTML = 'X';

        var newTermHeader = document.createElement('div');
        newTermHeader.setAttribute('class', 'terminal-header');
        newTermHeader.innerHTML = 'term' + tid;
        newTermHeader.appendChild(newCloseBtn);

        var newTermCont = document.createElement('div');
        newTermCont.setAttribute('class', 'terminal-cont');
        newTermCont.appendChild(newTermHeader);
        newTermCont.appendChild(newTerm);

        document.getElementById('container').appendChild(newTermCont);

        /* add cmds pre-defined */
        var l = ['ls', 'cd ..', 'cd ~'];
        var newMenutagName = document.createElement('span');
        newMenutagName.innerHTML = 'Term ' + tid;

        var newMenutagA = document.createElement('a');
        newMenutagA.setAttribute('href', '#');
        newMenutagA.appendChild(newMenutagName);

        var newMenutag = document.createElement('li');
        newMenutag.setAttribute('class', 'has-sub');
        newMenutag.appendChild(newMenutagA);

        var newMenutagUl = document.createElement('ul');
        newMenutag.appendChild(newMenutagUl);
        for(var i in l){
            var newCmdName = document.createElement('span');
            newCmdName.innerHTML = l[i];

            var newCmdA = document.createElement('a');
            newCmdA.setAttribute('href', 'javascript:runCommand(\'term' + tid + '\', \'' + l[i] + '\');');
            newCmdA.appendChild(newCmdName);

            var newCmd = document.createElement('li');
            newCmd.appendChild(newCmdA);
            
            newMenutagUl.appendChild(newCmd);
        }
        document.getElementById('termlist').appendChild(newMenutag);

        /* for getting user's input command */
        // stream.on('data', function (data) {
        // });

        /*  */
        termMan['term' + tid] = {
            obj: newTermCont,
            menutag: newMenutag,
            stream: stream
        };
    }
    else{
        alert('Can\'t create more!');
    }
}

function removeTerminal(termName){
    document.getElementById('container').removeChild(termMan[termName].obj);
    document.getElementById('termlist').removeChild(termMan[termName].menutag);
    termNums[parseInt(termName[4])] = false;
    delete termMan[termName];
    socket.emit('remove', termName);
}

function runCommand(termName, cmd){
    termMan[termName].stream.write(cmd + '\n');
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