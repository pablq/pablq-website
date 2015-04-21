this application is in a state of flux.

the server will now get routes. the routes will be /baseball /football /nhl and maybe /basketball.

upon a 'GET' to each route the server will hit the appropriate espn endpoint i found and return the data in nice json objects.

for now i will not support any other methods.

the front end will be a static html page with a small javascript file.

at moments not yet decided a user's click will trigger an http request to the servers endpoints and a section of the html will be populated and displayed with the data.

the details of the above are yet to be worked out.

i am insistent on keeping the front end and server vanilla. i'm doing this as practice. i could do this way faster using express and jquery (or another front end lib)

other things to work out on the server side:
- make sure server only sends files in a certain folder.
- is the favicon being served?
- keep logic clean!

Pablo
