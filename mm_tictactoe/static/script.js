
var BLANK_PIECE = 0;
var X_PIECE = 1;
var O_PIECE = 4;
var END_WIN = 0;
var END_LOSS = 1;
var END_DRAW = 2;

function gameMove() {
    unbindBlanks();
    $(this).hide()
        .attr('class', 'o')
        .fadeIn(400, gameMoveEnd);
}

function gameMoveEnd(){
    $gamePiece = $(this);
    $.ajax({
        type: "POST",
        url:"/gameJAX/",
        data: {'gridIndex': $gamePiece.attr('id')},
        complete: gameMoveResponse
    });
}

function gameMoveResponse(response, status) {
    if (status != "success") {
        // TODO: Handle an error!
        return;
    }

    var gameData = $.parseJSON(response.responseText);
    var ended = gameData.ended;
    var board = gameData.board;

    for (var i = 0; i < board.length; i++) {
        $gamePiece = $('div#'+i);
        if (board[i] == X_PIECE) {
            if (!$gamePiece.hasClass('x')) {
                markNewPiece($gamePiece, X_PIECE);
            }
        }
        else if (board[i] == O_PIECE) {
            if (!$gamePiece.hasClass('o')) {
                markNewPiece($gamePiece, O_PIECE);
            }
        }
    }

    if (ended) {
        endGame(gameData);
    } else {
        bindBlanks();
    }
}

function endGame(gameData) {
    $('section#gameSection').removeClass('active');
    $('section#gameSection').addClass('obscured');
    $('section#gameEndSection').addClass('active');

    $gameEndMessage = $('#gameEndMessage').html('<p>');
    switch (gameData.endState) {
        case END_WIN:
            $gameEndMessage.append("You Win!<br />");
            break;
        case END_LOSS:
            $gameEndMessage.append("You Lose!<br />");
            break;
        case END_DRAW:
            $gameEndMessage.append("It's a draw!<br />");
            break;
    }
    $gameEndMessage.append("Record:<br />")
        .append("Wins: " + gameData.wins)
        .append("  Losses: " + gameData.losses)
        .append("  Draws: " + gameData.draws)
        .append("</p>")
        .append("<a href='#'>New Game?</a>")
    $('#content').click(requestNewGame);
}

function bindBlanks() {
    $(".blank").click(gameMove);
}

function unbindBlanks() {
    $(".blank").unbind('click');
}

function markNewPiece($gamePiece, piece) {
    $gamePiece.hide()
        .unbind('click');
    switch (piece) {
        case X_PIECE:
            $gamePiece.attr('class', 'x');
            break;
        case O_PIECE:
            $gamePiece.attr('class', 'o');
            break;
    }
    $gamePiece.fadeIn({duration:200});
}

function requestNewGame() {
    $('#content').unbind('click');
    $.ajax({
        type: "POST",
        url: "/newGameJAX/",
        complete: receivedNewGame
    });
}

function receivedNewGame(response, status) {
    $('section#gameEndSection').removeClass('active');
    $('section#gameSection').removeClass('obscured');
    $('section#gameSection').addClass('active');
    $('#navNewGame').removeClass('selected');
    setupNewGame(response, status);
}

function setupNewGame(response, status) {
    if (status != "success") {
        // TODO: Handle an error!
        return;
    }

    unbindBlanks();
    var gameData = $.parseJSON(response.responseText);
    var ended = gameData.ended;
    var board = gameData.board;

    // TODO: This looks very similar to the gameMoveResponse loop, but
    // it marks ever square in the box.  Consider consolidating these
    // at some point.
    for (var i = 0; i < board.length; i++) {
        $gamePiece = $('div#'+i);
        if (board[i] == X_PIECE) {
            markNewPiece($gamePiece, X_PIECE);
        }
        else if (board[i] == O_PIECE) {
            markNewPiece($gamePiece, O_PIECE);
        } else {
            $gamePiece.attr('class','blank');
        }
    }
    bindBlanks();
}

function controlNavClicked() {
    var $navItem = $(this);
    $navItem.attr('class', 'selected');
    switch ($navItem.attr('id')) {
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

function colorsNavClicked() {
    var $navItem = $(this);
    $navItem.attr('class', 'selected');
    switch ($navItem.attr('id')) {
        case 'green':
            less.modifyVars({darkColor: '@darkGreen'});
            break;
        case 'blue':
            less.modifyVars({darkColor: '@darkBlue'});
            break;
        case 'purple':
            less.modifyVars({darkColor: '@darkPurple'});
            break;
    }
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

/* Used to setup CSRF token handling */
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

/* Used to setup CSRF token handling */
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}

$(document).ready(function(){
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
            // Send the token to same-origin, relative URLs only.
            // Send the token only if the method warrants CSRF protection
            // Using the CSRFToken value acquired earlier
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
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

    bindBlanks();
    $("nav#controls > ul > li").click(controlNavClicked);
    $("nav#colors > ul > li").click(colorsNavClicked);
});
