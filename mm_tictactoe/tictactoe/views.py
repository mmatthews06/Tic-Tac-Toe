# Create your views here.

from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.views.generic.simple import direct_to_template

def home(request):
    print "boo!"
    return render_to_response('home.html')

def login(request):
    pass

def setUserAndStart(request):
    pass

def game(request):
    pass
