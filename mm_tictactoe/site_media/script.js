
var BLANK_PIECE = 0;
var X_PIECE = 1;
var O_PIECE = 4;
var END_WIN = 0;
var END_LOSS = 1;
var END_DRAW = 2;

function gameMoveEnd(e) {
    var targ;
    if (!e) var e = window.event;
    if (e.target) targ = e.target;
    else if (e.srcElement) targ = e.srcElement;
    targ.setAttribute('id', '');
    
    var gameMoveIndex = targ;
    var gridIndex = $(targ).data().gridIndex;
    
    var data = { 'gridIndex': gridIndex };
    var args = { type:"POST", url:"/gameJAX/", data:data,
        complete:gameMoveResponse };
    $.ajax(args);
}

function gameMove(e) {
    var targ;
    if (!e) var e = window.event;
    if (e.target) targ = e.target;
    else if (e.srcElement) targ = e.srcElement;
    $(targ).data('gridIndex', targ.id);
    if (!$.browser.webkit) {
        gameMoveEnd(e);
        return false;
    }
            
    targ.addEventListener('webkitAnimationEnd', gameMoveEnd, false);
    targ.setAttribute('class', 'o');
    targ.setAttribute('id', 'animated');
                
    return false;
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

    $('#gameBoard').html(gameSquares.join(''));
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
        endMessage += "</p>";
        endMessage += "<a href='#' onclick='requestNewGame(event)'>New Game?</a>";
        $('#gameEndMessage').html(endMessage);
    }
}

function navClicked(e) {
    var navItem;
    if (!e) var e = window.event;
    if (e.target) navItem = e.target;
    else if (e.srcElement) navItem = e.srcElement;
    
    navItem.setAttribute('class', 'selected');
                
    switch (navItem.id) {
        case 'navHome':
            window.location.href = "/home/";
            break;
        case 'navNewGame':
            requestNewGame();
            break;
        case 'navCurGame':
            window.location.href = "/game/";
            break;
    }
    
}

function requestNewGame() {
    var args = { type:"POST", url:"/newGameJAX/",
        complete:receivedNewGame };
    $.ajax(args);
}

function receivedNewGame(res, status) {
    $('section#gameEndSection').removeClass('active');
    $('section#gameSection').removeClass('obscured');
    $('section#gameSection').addClass('active');
    $('#navNewGame').removeClass('selected');
    gameMoveResponse(res, status);
}

window.addEventListener('load', function() {
  window.setTimeout(function() {
    var bubble = new google.bookmarkbubble.Bubble();

    var parameter = 'bmb=1';

    bubble.hasHashParameter = function() {
      return window.location.hash.indexOf(parameter) != -1;
    };

    bubble.setHashParameter = function() {
      if (!this.hasHashParameter()) {
        window.location.hash += parameter;
      }
    };

    bubble.showIfAllowed();
  }, 1000);
}, false);
