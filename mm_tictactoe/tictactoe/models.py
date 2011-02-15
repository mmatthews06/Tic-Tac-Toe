from django.db import models

# Create your models here.
class Player(models.Model):
    name = models.TextField(null=False,unique=True)
    wins = models.IntegerField(default=0)
    losses = models.IntegerField(default=0)
    lastLogin = models.DateTimeField('Last Login')

class Game(models.Model):
    player1 = models.ForeignKey(Player)
    player2 = models.ForeignKey(Player)
    winner = models.ForeignKey(Player)
    board = models.CommaSeparatedIntegerField(max_length=9)

