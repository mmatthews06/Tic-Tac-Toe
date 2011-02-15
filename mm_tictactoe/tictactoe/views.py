# Create your views here.
from datetime import datetime

from django.http import HttpResponseRedirect
from django.template import RequestContext
from django.shortcuts import render_to_response
from django.contrib import messages

from models import Player, Game

def home(request):
    return render_to_response('home.html',
            context_instance=RequestContext(request))

def login(request):
    playerName = request.POST.get("playerName")
    if not playerName:
        return None # TODO: Throw an exception

    player = Player.objects.get_or_create(name=playerName)[0]
    player.lastLogin = datetime.now()

    game = Game(player1=player)
    game.nextTurn()

    player.save()
    game.save()
    request.session['player'] = player
    request.session['game'] = game
    return HttpResponseRedirect('/game/')

def game(request):
    game = request.session['game']
    player = request.session['player']

    endGame = False
    if request.method == 'POST':
        index = int(request.POST['index'])
        playerChar = game.O
        otherPlayerChar = game.X
        if player == game.player2:
            playerChar = game.X
            otherPlayerChar = game.O

        game.board[index] = playerChar

        if game.checkWinner(playerChar):
            messages.add_message(request, messages.INFO, 'You won!')
            endGame = True

        if game.nextTurn(otherPlayerChar):
            messages.add_message(request, messages.INFO, 'You lost!')
            endGame = True

        game.save()
        request.session['game'] = game
    return render_to_response('game.html',
            {'game': game, 'endGame': endGame},
            context_instance=RequestContext(request))

