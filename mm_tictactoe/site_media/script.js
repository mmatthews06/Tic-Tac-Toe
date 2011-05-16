
function gameMove(e) {
    var targ;
    if (!e) var e = window.event;
    if (e.target) targ = e.target;
    else if (e.srcElement) targ = e.srcElement;
    
    var gameMoveIndex = targ;
    var gameMoveInt = parseInt(gameMoveIndex.id);
    
    var data = { gridIndex: gameMoveInt };
    var args = { type:"POST", url:"/gameJAX/", data:data,
        complete:gameMoveResponse };
    $.ajax(args);
}

function gameMoveResponse(res, status) {
    if (status != "success") {
        // TODO: Handle an error!
        return;
    }

    res = $.parseJSON(res.responseText);
    var ended = res.ended;
    var board = res.board;
    var gameSquares = [];

    gameSquares.push('<tr>')
    for (var i = 0; i < board.length; i++) {
        if (i > 0 && !(i % 3)) {
            gameSquares.push('</tr>')
            gameSquares.push('<tr>')
        }
        if (board[i] == 1)
            gameSquares.push('<td><div class="x"></div></td>');
        else if (board[i] == 4)
            gameSquares.push('<td><div class="o"></div></td>');
        else {
            tdString = '<td><div id="' + i + '" class="blank"';
            if (!ended)
                tdString += ' onclick="gameMove(event)"'
            tdString += '></div></td>';
            gameSquares.push(tdString);
        }
    }

    var $gameBoard = $('#gameBoard');
    $gameBoard.empty();
    $gameBoard.append(gameSquares.join(''));
}

function navClicked(e) {
    var navItem;
    if (!e) var e = window.event;
    if (e.target) navItem = e.target;
    else if (e.srcElement) navItem = e.srcElement;
    
    // FIXME: This is a pretty hacky way to get a click
    // background changed, but works well enough for now.
    // Need to clean up the nav bar (move New Game off),
    // and make this a real selection.
    navItem.setAttribute('class', 'selected');
                
    switch (navItem.id) {
        case 'navHome':
            window.location.href = "/home/";
            break;
        case 'navNewGame':
            window.location.href = "/newGame/";
            break;
        case 'navCurGame':
            window.location.href = "/game/";
            break;
    }
    
}
