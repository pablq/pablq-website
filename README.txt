Currently just serving static files with a plain node.js backend.

However... Muahahaha

I have an idea to do something pretty fun.

I'll hit this espn endpoint to get the current mlb status for games.

Using the data from that I'll generate an image.

When that image is done being generated I'll send a static html page that asks for it (along with CSS file)

If there is an error anywhere along the way, I'll just send a different static html page that asks for a pre-prepared image (maybe a random one of my gifs (ouch, though, that would be a lot of space). It's worth it for now.

*** i'll leave the above because I'm a bit out of it.

New Idea:

keep the above... except... i also connect to a database.

that database holds my "thoughts of the day"

there is a special endpoint only i can hit that create's a thought and of course the day is recorded automatically.

when the user visits my site they will be greeted with either:

"""
Pablo's thought of the day:

<the thought here>

click here for this month's thoughts

click here for the current baseball scores
"""

of course, both of the 'click here' sections will open up to auto-genned html.

the question is... do i want to do ajax calls from the javascript?

the answer is yes. !!!BUT!!! i don't want to use jquery. sooooooooo.... the result is I MUST LEARN TO DO AJAX WITHOUT USING JQUERY.

OR AT LEAST LEARN IT'S TOO MUCH OF A HASSLE TO EVER WANT TO DEAL WITH (then tuck tail and just use jquery)

*** k that's it.

Pablo
