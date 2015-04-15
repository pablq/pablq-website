module.exports = (function(){ 

    function parseComponentFn (c) {
        c = c.replace(/%[ABC][A-Z0-9](%20)+/g, ""); // special consideration for problematic line (has Outs)
        c = c.replace(/(%20){3}/g, " "); // line between teams / scores
        c = c.replace(/%20/g," "); // replace spaces
        return c;
    };
    
    function getGames (data) {

        var count,
            totalCount = parseInt(data["mlb_s_count"]),
            keys = Object.keys(data),
            games = [];

        for (count = 0; count < totalCount; count += 1) {

            (function () {

                var game = { _id: count + 1 },
                    match,
                    kIndex = 0,
                    key;

                match = new RegExp("^mlb_s_(url|left|right)" + (count + 1).toString() + "(_|$)");

                while (kIndex < keys.length) {
                    key = keys[kIndex];
                    if (key.search(match) > -1) {
                        game[key] = data[key];
                        keys.splice(kIndex, 1);
                    } else {
                        kIndex += 1;
                    }
                }
                games.push(format(game));
            })()
        }
        return games;
    }
    
    
    /*
        expected key -> values:
        - _id                 -> ID
        - mlb_s_leftID        -> pregame: teams and time, ingame: teams, scores, and inning, postgame: final score>
        - mlb_s_rightID_count -> how many mlb_s_right<id>_n tags are there? number
        - mlb_s_rightID_1     -> (only present when count > 0) pregame: pitching matchup, ingame: outs, postgame: pitching scorers
        - mlb_s_urlID         -> url for live gamecast
    */

    function format(game) {

        var formatted = {},
            id = game._id,
            count = parseInt(game["mlb_s_right" + id + "_count"]),
            i;
        
        for (i = 0; i < count; i += 1) {
            formatted["p" + (i + 1)] = game["mlb_s_right" + id + "_" + (i + 1)];
        }
        formatted.lineCount = count;
        formatted.headline = game["mlb_s_left" + id];
        formatted.link = game["mlb_s_url" + id];

        return formatted;
    }
    
    function isSox(game) {
        return game.headline.indexOf("Chicago Sox") > 0;     
    }
    function isCubs(game) {
        return game.headline.indexOf("Chicago Cubs") > 0;     
    }
    
    //<div onclick="location.href='YOUR-URL-HERE';" style="cursor: pointer;"></div>
    function gameToHTML(game) {
        var gameString = "<div class='game'><h2>",
            i, len;

        if (isSox(game) || isCubs(game))
            gameString = "<div class='game' id='vip'><h2>";

        gameString += game.headline + "</h2>";
        for (i = 0, len = game.lineCount; i < len; i += 1) {
            gameString += "<p>" + game["p" + (i + 1)] + "</p>";
        }
        gameString += "<a href=" + game.link + ">live</a></div>";

        return gameString;
    }
    
    function getHTML(games) {
        var i, len, 
            html = "<html><head><title>Today's Games</title>" +
                   "<link rel='stylesheet' type='text/css' href='/css/style.css'>" +
                   "<meta name='description' content='Dynamically Generated'>" +
                   "<meta name='author' content='pablq'>" +
                   "<meta charset='UTF-8'></head>";
        
        for (i = 0, len = games.length; i < len; i += 1) {
            html += gameToHTML(games[i]);
        }
        
        html += "<br/><a href='https://github.com/pablq'>https://github.com/pablq</a>" +
                "</body></html>";
        
        return html;
    }

    return {
        parseComponentFn: parseComponentFn,
        getGames: getGames,
        getHTML: getHTML
    }
})()
