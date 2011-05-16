
function gameMove(e) {
    var targ;
    if (!e) var e = window.event;
    if (e.target) targ = e.target;
    else if (e.srcElement) targ = e.srcElement;
    
    var gameMoveIndex = targ;
    var gameMoveInt = parseInt(gameMoveIndex.id);
    
    // Now do the right thing.

    window.console.log("Game piece clicked: " + gameMoveInt);
    var data = { gridIndex: gameMoveInt };
    var args = { type:"POST", url:"/gameJAX/", data:data,
        complete:gameMoveResponse };
    $.ajax(args);
}

function gameMoveResponse(res, status) {
    if (status != "success") {
        return;
    }

    window.console.log('Success! ' + res);
}
