var http = require("http"),
    qs = require("querystring");

(function () {

    var paths = [ "/mlb/bottomline/scores", "/nfl/bottomline/scores", "/nba/bottomline/scores","/nhl/bottomline/scores" ];
    
    var routes = {
        mlb: function (res) {
            var data = requestFromESPN("mlb");
            if (data 
        }
        nhl: handleNHL,
        nba: handleNBA,
        nfl: handleNFL
    }    

    function requestFromESPN(league) {
            
        var path = "/bottomline/scores",
            options = {
                hostname: "sports.espn.go.com",
                path: "/" + league + path,
                port: 80,
                method: "GET"
            },
            gameReq;

        gameReq = http.request(options, function (gameRes) {

            var data = "";
            gameRes.setEncoding("utf8");
            gameRes.on("data", function (chunk) {
                data += chunk;
            });
            gameRes.on("end", function () {
                return getGames(qs.parse(data), league);
            });
        });

        gameReq.on("error", function (e) {
           return null;
        });

        gameReq.end();
    }

    function getGames (data, league) {

        var count,
            totalCount = parseInt(data[league + "_s_count"]),
            keys = Object.keys(data),
            games = [];

        for (count = 0; count < totalCount; count += 1) {

            (function () {

                var game = { _id: count + 1 },
                    match,
                    kIndex = 0,
                    key;

                match = new RegExp("^" + league + "_s_(url|left|right)" + (count + 1).toString() + "(_|$)");

                while (kIndex < keys.length) {
                    key = keys[kIndex];
                    if (key.search(match) > -1) {
                        game[key] = data[key];
                        keys.splice(kIndex, 1);
                    } else {
                        kIndex += 1;
                    }
                }
                games.push(formatGame(game,league));
            })()
        }
        return games;
    }

    function formatGame(game,league) {

        var formatted = {},
            id = game._id,
            count = parseInt(game[league + "_s_right" + id + "_count"]),
            i;
        
        for (i = 0; i < count; i += 1) {
            formatted["p" + (i + 1)] = game[league+ "_s_right" + id + "_" + (i + 1)];
        }
        formatted.lineCount = count;
        formatted.headline = game[league+"_s_left" + id];
        formatted.link = game[league+"_s_url" + id];

        return formatted;
    }

})()
