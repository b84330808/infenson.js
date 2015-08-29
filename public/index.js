/* terminal number list */

var terminalLimit = 10;
var termNums = [];
for (var i = 0; i < terminalLimit; i++) {
    termNums.push(false);
}
/* terminals manager */
var termMan = {};

/* socket for terminal control */
var socket = io(location.origin + '/termctl');

/* auto create one terminal (default)  and focus on it*/
createNewTerminal();
$('#term0').css('background-color', '#1A1B1A');
$('#term0').focus();
/* create a new ternimal */
function createNewTerminal() {
    /* get a idle number from terminal number list */
    var tid = undefined;
    for (var i = 0; i < terminalLimit; i++) {
        if (!termNums[i]) {
            termNums[i] = true;
            tid = i;
            break;
        }
    }

    /* if get */
    if (tid != undefined) {
        /* create new tag on DOM */
        var newTerm = document.createElement('pre'); //terminal interface
        newTerm.setAttribute('id', 'term' + tid); //give the terminal dom an  id
        newTerm.setAttribute('class', 'terminal'); //assign the terminal class `terminal`
        newTerm.setAttribute('data-columns', '50'); //assign the terminal data-columns
        newTerm.setAttribute('data-rows', '24'); ////assign the terminal data-rows

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

        /* append the new terminal object to terminal-board */
        var newCloseBtn = document.createElement('a'); //button for closing terminal 
        newCloseBtn.setAttribute('class', 'close-button'); //assign the button class `close-button`
        newCloseBtn.setAttribute('href', 'javascript:removeTerminal(\'term' + tid + '\')'); //assign the button behavior
        newCloseBtn.innerHTML = 'X'; //the close button image

        /* create terminal header */
        var newTermHeader = document.createElement('div');
        newTermHeader.setAttribute('class', 'terminal-header');

        var newTermInfo = document.createElement('span');
        newTermInfo.setAttribute('class', 'terminal-info');
        newTermInfo.innerHTML = 'term' + tid;

        newTermHeader.appendChild(newTermInfo);
        newTermHeader.appendChild(newCloseBtn);

        /* create a terminal containing header and interface*/
        var newTermCont = document.createElement('div');
        newTermCont.setAttribute('class', 'terminal-container');
        newTermCont.appendChild(newTermHeader);
        newTermCont.appendChild(newTerm);

        document.getElementById('terminal-board').appendChild(newTermCont);

        /* add cmds pre-defined */
        //var l = ['ls', 'cd ..', 'cd ~'];

        /*create a terminal name be put in header later*/
        // var newMenutagName = document.createElement('span');
        // newMenutagName.innerHTML = 'Term ' + tid;


        // var newMenutagA = document.createElement('a');
        // newMenutagA.setAttribute('href', '#');
        // newMenutagA.appendChild(newMenutagName);

        // var newMenutag = document.createElement('li');
        // newMenutag.setAttribute('class', 'has-sub');
        // newMenutag.appendChild(newMenutagA);

        // var newMenutagUl = document.createElement('ul');
        // newMenutag.appendChild(newMenutagUl);
        // for (var i in l) {
        //     var newCmdName = document.createElement('span');
        //     newCmdName.innerHTML = l[i];

        //     var newCmdA = document.createElement('a');
        //     newCmdA.setAttribute('href', 'javascript:runCommand(\'term' + tid + '\', \'' + l[i] + '\');');
        //     newCmdA.appendChild(newCmdName);

        //     var newCmd = document.createElement('li');
        //     newCmd.appendChild(newCmdA);

        //     newMenutagUl.appendChild(newCmd);
        // }
        // document.getElementById('termlist').appendChild(newMenutag);

        /* for getting user's input command */
        // stream.on('data', function (data) {
        // });

        /*  */
        termMan['term' + tid] = {
            obj: newTermCont,
            //menutag: newMenutag,
            stream: stream
        };

    } else {
        alert('Can\'t create more!');
    }
}

function removeTerminal(termName) {
    document.getElementById('terminal-board').removeChild(termMan[termName].obj);
    //document.getElementById('termlist').removeChild(termMan[termName].menutag);
    termNums[parseInt(termName[4])] = false;
    delete termMan[termName];
    socket.emit('remove', termName);
}

function hideBar() {
    document.getElementById('nav-bar').style.display = 'none';
    document.getElementById('content').style.marginTop = '0px';
    document.getElementById('showBar').style.display = 'block';

}

function showBar() {
    document.getElementById('nav-bar').style.display = '';
    document.getElementById('content').style.marginTop = '35px';
    document.getElementById('showBar').style.display = 'none';
}

function showCommandBoard() {
    document.getElementById('commandBoard').style.display = 'block';
    document.getElementById('commandBoardBtnLink').href = 'javascript:hideCommandBoard()'
    document.getElementById('commandBoardBtnText').innerHTML = 'close&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;command';
}

function hideCommandBoard() {
    document.getElementById('commandBoard').style.display = 'none';
    document.getElementById('commandBoardBtnLink').href = 'javascript:showCommandBoard()'
    document.getElementById('commandBoardBtnText').innerHTML = 'custom command';

}

///////Quick focus next//////

var focusedTerm = $('#term0'); //default
function focused() {
    if ($(":focus").hasClass('terminal')) {
        focusedTerm.css('background-color', '#000000');
        focusedTerm = $(":focus");
        focusedTerm.css('background-color', '#1A1B1A');
    };
}

//////////////////////////////////

// function editCommand(commandIndex){
//     var value = document.getElementById('commandIndex').innerHTML;
//     document.createElement('textarea');

// }


//<div class='command' id='command1' ondblclick='javascript: editCommand(command1)'>ls</div>

// function runCommand(termName, cmd) {
//     termMan[termName].stream.write(cmd + '\n');
// }

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

/*
|--nav-bar
|
|--content
            |
            --------------terminal-board (id)
            |
            --------------terminal-container (class)
            |                              |
            |                              ----------------terminal-header (class)
            |                              |                       |
            |                              |                       -----------terminal-info (class)
            |                              |                       |
            |                              |                       ------------close-button  (class)
            |                              |
            |                              ----------------terminal (class)
            |
            --------------terminal-container (class)
            |                              |
            |                              ----------------terminal-header (class)
            |                              |                       |
            |                              |                       -----------terminal-info
            |                              |                       |
            |                              |                       ------------close-button
            |                              |
            |                              ----------------terminal (class)
            |
            --------------terminal-container (class)
            |                              |
            |                              ----------------terminal-header (class)
            |                              |                       |
            |                              |                       -----------terminal-info
            |                              |                       |
            |                              |                       ------------close-button
            |                              |
            |                              ----------------terminal (class)

*/
