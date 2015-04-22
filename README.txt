this application is in a state of flux.

the server uses ECMAScript 6 so it should be run with the --harmony flag

next up: resolve front end.
1. create functionality to update data without leaving page.
2. what happens if the server sends shitty data??? protect against this.
3. figure out how you want the layout to be.
    > mobile first!
    > simple but stylish.
    > do try to work a small animation in there!

i am insistent on keeping the front end and server vanilla for this iteration. 
i'm doing this to learn the dom and get a better sense for what kinds of things are being done for me behind the scenes with various frameworks.

things to work out yet on the server side:
- i'm still getting messed up symbols in baseball (for out counts). -> i need a robust solution
- is the favicon being served?
- think about the routes... something about the way you're doing it doesn't feel clean. think about a better way to do the routing.
    ^ ask someone about how to do it.

Pablo
