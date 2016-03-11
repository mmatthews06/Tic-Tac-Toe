#Tic Tac Toe
This is a full stack implementation of a single-player Tic-Tac-Toe game, written using the Python Django framework for the backend, and mostly just jQuery and LESS.

Most of this code was written way back in 2011, and I have used my time since then on very different projects, but there may be an effort to spruce it up with some Angular or Backbone, and some Bootstrap.

##Setup and Usage
1. Install django in the manner described here: https://www.djangoproject.com/download/.  On my Mac, I ran these commands (see below for how to install virtualenv):
	```bash
	mkdir ttt_test
	cd ttt_test
	virtualenv tic-tac-toe_test
	source tic-tac-toe_test/bin/activate
	pip install django
	```

2. Clone the readonly repo:
	```bash
	git clone git://github.com/mmatthews06/Tic-Tac-Toe.git
	```

3. Change into the new directory, and create a new database:
	```bash
	cd Tic-Tac-Toe/mm_tictactoe
	python manage.py syncdb
	```

4. Start the server thusly:
	```bash
	python manage.py runserver
	```

5. Navigate to http://localhost:8000 in a browser (or host in a manner that would allow a mobile device to connect to the server)
6. Play the game!

##Tested on
- Firefox 21: works (no animations)
- Safari 5: works BEST (animations)
- Mobile Safari (iPhone/iPad): works BEST (animations)
- Google Chrome: works BEST (animations)
- Android mobile: works BEST (animations)
- Firefox 3.6: works (no CSS transitions)
- IE 9: works
- IE 6: does not work

##Quick Features List
- Served by Django
- HTML5 elements
- jQuery work
- AJAX for tic tac toe moves
- CSS gradients, and transitions
- CSS animations (on webkit)
- iPhone "Add to Home screen" functionality

##Installing VirtualEnv (on Mac OSX or Linux)
The commands can be found here, and are reproduced below: https://pypi.python.org/pypi/virtualenv
```bash
curl -O https://pypi.python.org/packages/source/v/virtualenv/virtualenv-X.X.tar.gz
tar xvfz virtualenv-X.X.tar.gz
cd virtualenv-X.X
[sudo] python setup.py install
```

Installing on Windows requires a little more, because you have to install Python 2.7 first, and add the python executable to your PATH variable.  Unfortunately, these appear to be the most straightforward directions:
https://zignar.net/2012/06/17/install-python-on-windows/

For better or worse, right now the site is "optimized" for mobile browsers.  It looks decent in a desktop browser, but the controls are only reasonable for mobiles.  Please see the TODO list for more mobile optimizations to come, and one desktop TODO.

Additionally, the Tic Tac Toe game itself is actually persisted in a database between calls, as are the "Players" that "login."  This was intended to eventually support a two-player game, which I thought would be a good extra credit feature.  I've since taken it the mobile route, and am adding features there, but I will try the two player system later anyway.  "Players" do not have a password because I thought that would be tedious to evaluate, and the Django admin page is left off, because there isn't really much to administer.

For the game itself, I went with an array of integers to represent the game board.  I felt like this was unique, and would allow for speedier algorithm execution, and potentially more compact, though probably more obscure, code.  For example, a quick performance test suggests that finding a potential winning Tic Tac Toe position like this:
```python
t = [1,1,0]   # where 1 is 'x', and 0 is the empty spot that gets the win
if(sum(t) == 2)
# insert 1 where the 0 is found
```

...is quicker than testing like this:
```python
t = ['x', 'x', None]
if(t == ['x', 'x', None] or t == [None, 'x', 'x'] or t == ['x', None, 'x'])
# insert 'x' where None is found
```

The first example seems more compact, as well.  There is probably a better solution than either of these, but I was happy with how it worked out.  See below for a real performance test that I did.

##TODO
- Still need slightly better looking win/loss/draw game ending dialog
- Much better colors
- More single page app functionality
- Work on two-player system.  Will likely require:
	- Turn timer to prevent stalling, and allow AJAX syncing
	- Persist a list of logged in players.
	- Probably require unique player names.  Will try to avoid passwords, though.
	- A way to clear out a player once they've timed out.
	- AJAX timer to check for game requests from a different player, plus a heartbeat
	- TODO: add to this list.

##Performance Test
The quick comparison tests that I ran to find a potential tictactoe win:
```python
i = 100000
L = [['x','x',None],[None,'x', 'x'],['x','o',None],['o','o', None]] # winnable permutations
wins = 0
while i:                                                            # find a win
    for l in L:
        if l == ['x','x',None] or l == [None,'x','x'] or l == ['x',None,'x']:
            wins += 1
    i -= 1
print wins
```

```bash
time python chars.py
200000
real	0m0.276s
user	0m0.265s
sys	0m0.010s
```

```python
L = [[1,1,0],[0,1,1],[1,0,0],[0,0,1]] # winnable permutations
wins = 0
while i:			      # find a win
    for l in L:
        if sum(l) == 2:
            wins += 1
    i -= 1
print wins
```
```bash
time python nums.py
200000
real	0m0.185s
user	0m0.173s
sys	0m0.010s
```

It appears that the number system is faster than the crude character win test here.

##CREDITS
Free icons came from here:
iPhone Home screen app icon: http://ii-r4nd0m-w0lf-ii.deviantart.com/art/FREE-tic-tac-toe-icon-184091530
New game wand: http://www.iconarchive.com/show/oxygen-icons-by-oxygen-icons.org/Actions-games-solve-icon.html
Current game chess icon: http://www.iconarchive.com/show/black-and-blue-add-on-icons-by-icondrawer/black-chess-icon.html
Home nave icon: http://www.iconarchive.com/show/oxygen-icons-by-oxygen-icons.org/Actions-go-home-icon.html
Background: http://www.coxmediagroup.com/ (with a simple color modification)
