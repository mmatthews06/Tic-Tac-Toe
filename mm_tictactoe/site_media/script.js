
var BLANK_PIECE = 0;
var X_PIECE = 1;
var O_PIECE = 4;
var END_WIN = 0;
var END_LOSS = 1;
var END_DRAW = 2;

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
        if (board[i] == X_PIECE)
            gameSquares.push('<td><div class="x"></div></td>');
        else if (board[i] == O_PIECE)
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
    if (ended) {
        var endMessage = '<p>';
        $('section#gameSection').removeClass('active');
        $('section#gameSection').addClass('obscured');
        $('section#gameEndSection').addClass('active');
        switch (res.endState) {
            case END_WIN:
                endMessage += "You Win!<br />";
                break;
            case END_LOSS:
                endMessage += "You Lose!<br />";
                break;
            case END_DRAW:
                endMessage += "It's a draw!<br />";
                break;
        }
        endMessage += "Record:<br />"
        endMessage += "Wins: " + res.wins;
        endMessage += "  Losses: " + res.losses; 
        endMessage += "  Draws: " + res.draws;
        endMessage += "</p>"
        $('#gameEndMessage').html(endMessage);
    }
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
