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

    def __translateBoard(self, board):
        transBoard = []
        for piece in board:
            if piece == 'O':
                transBoard.append(Game.O)
            elif piece == 'X':
                transBoard.append(Game.X)
            else:
                transBoard.append(Game.EMPTY)

        return transBoard

    def __setupGame(self, startingBoard, turns):
        startingBoard = self.__translateBoard(startingBoard)
        player1 = Player(name="player1")
        player2 = Player(name="player2")
        game = Game(player1=player1, player2=player2)
        game.board = startingBoard
        game.turn = turns
        return game

    def test_3GamesToDraw(self):
        """
        Simply play three games with computer X and O moves, and make
        sure nobody wins.
        """
        game1 = self.__playGame()
        self.assertEqual(filter(lambda x: x==0, game1.board), [])
        self.assertFalse(game1.checkWinner(game1.X))
        self.assertFalse(game1.checkWinner(game1.O))
        self.assertEqual(sum(game1.board), 5*Game.X + 4*Game.O,
            "Not all spaces are filled")

        game2 = self.__playGame()
        self.assertEqual(filter(lambda x: x==0, game2.board), [])
        self.assertFalse(game2.checkWinner(game2.X))
        self.assertFalse(game2.checkWinner(game2.O))
        self.assertEqual(sum(game2.board), 5*Game.X + 4*Game.O,
            "Not all spaces are filled")

        game3 = self.__playGame()
        self.assertEqual(filter(lambda x: x==0, game3.board), [])
        self.assertFalse(game3.checkWinner(game3.X))
        self.assertFalse(game3.checkWinner(game3.O))
        self.assertEqual(sum(game3.board), 5*Game.X + 4*Game.O,
            "Not all spaces are filled")


    def test_fillCornerAsFirstMove(self):
        """
        Following the logic of the game, the first move should be a corner
        move.
        """
        turn = 0
        startingBoard = ['_', '_', '_',
                         '_', '_', '_',
                         '_', '_', '_',]

        game = self.__setupGame(startingBoard, turn)
        game.nextTurn(Game.X)

        # Just make sure there is only one X in one of the random corners
        self.assertEqual(sum(game.board[i] for i in Game.CORNERS), Game.X)


    def test_fillCenterAsSecondMove(self):
        """
        Following the logic of the game, if the opponent has made their
        first move in a corner, then the second move should be in the center.
        """
        turn = 1
        startingBoard = ['X', '_', '_',
                         '_', '_', '_',
                         '_', '_', '_',]

        expected = self.__translateBoard(['X', '_', '_',
                                          '_', 'O', '_',
                                          '_', '_', '_'])

        game = self.__setupGame(startingBoard, turn)
        game.nextTurn(Game.O)
        self.assertEqual(game.board, expected)


    def test_winBeforeBlock(self):
        """
        The computer move should win the game before blocking.  Also,
        the nextTurn() method should return True, since this move produced
        a winner, and the checkWin() method should return true for X, but
        false for O.

        Starting board:
            O O _
            X X _
            _ _ _

            It's the X player's turn.  It should win the game as such:
            O O _
            X X X
            _ _ _

        """
        startingBoard = ['O', 'O', '_',
                         'X', 'X', '_',
                         '_', '_', '_']

        expected = self.__translateBoard(['O', 'O', '_',
                                          'X', 'X', 'X',
                                          '_', '_', '_'])

        # Setup a fake game
        game = self.__setupGame(startingBoard, 4)

        # make sure the "AI" wins
        win = game.nextTurn(Game.X)
        self.assertEqual(game.board, expected)
        self.assertTrue(win)
        self.assertTrue(game.checkWinner(game.X))
        self.assertFalse(game.checkWinner(game.O))

    def test_blockWin(self):
        """
        Block a potential win before a fork.  Starting board:
            O _ X
            _ X _
            O _ _

        The computer should block the potential win by putting an X
        between the two O's.  There is a potential fork by placing an X
        in the empty spot to the right of the X, but that would mean the
        O's could win.
        """
        startingBoard = ['O', '_', 'X',
                         '_', 'X', '_',
                         'O', '_', '_']

        expected = self.__translateBoard(['O', '_', 'X',
                                          'X', 'X', '_',
                                          'O', '_', '_'])

        # Setup a fake game
        game = self.__setupGame(startingBoard, 4)

        # make a move and make sure the AI blocked instead forked
        game.nextTurn(Game.X)
        self.assertEqual(game.board, expected)


    def test_forkBeforePlayingCenter(self):
        """
        In this test, the center is open, but there is an opportunity to
        fork the board (i.e., give the AI two chances to win the game)
        """
        startingBoard = ['X', 'O', '_',
                         '_', '_', 'O',
                         '_', 'X', '_']

        expected = self.__translateBoard(['X', 'O', '',
                                          '_', '_', 'O',
                                          'X', 'X', '_'])

        # Setup a fake game
        game = self.__setupGame(startingBoard, 4)

        game.nextTurn(Game.X)
        self.assertEqual(game.board, expected)


