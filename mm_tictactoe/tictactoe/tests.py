"""
This file demonstrates two different styles of tests (one doctest and one
unittest). These will both pass when you run "manage.py test".

Replace these with more appropriate tests for your application.
"""

from django.test import TestCase

from models import Player, Game

class TicTacToeTest(TestCase):
    def __playGame(self):
        player1 = Player(name="player1")
        player2 = Player(name="player2")
        game = Game(player1=player1, player2=player2)
        game.nextTurn(Game.X)
        game.nextTurn(Game.O)
        game.nextTurn(Game.X)
        game.nextTurn(Game.O)
        game.nextTurn(Game.X)
        game.nextTurn(Game.O)
        game.nextTurn(Game.X)
        game.nextTurn(Game.O)
        game.nextTurn(Game.X)
        return game

    def test_3GamesToDraw(self):
        """
        """
        game1 = self.__playGame()
        print "Board:\n", game1
        self.assertEqual(filter(lambda x: x==0, game1.board), [])
        self.assertFalse(game1.checkWinner(game1.X))
        self.assertFalse(game1.checkWinner(game1.O))

        game2 = self.__playGame()
        print "Board:\n", game2
        self.assertEqual(filter(lambda x: x==0, game2.board), [])
        self.assertFalse(game2.checkWinner(game2.X))
        self.assertFalse(game2.checkWinner(game2.O))

        game3 = self.__playGame()
        print "Board:\n", game3
        self.assertEqual(filter(lambda x: x==0, game3.board), [])
        self.assertFalse(game3.checkWinner(game3.X))
        self.assertFalse(game3.checkWinner(game3.O))

