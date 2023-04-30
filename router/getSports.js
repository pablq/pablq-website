var https = require("https"),
    http = require("http"),
    queryString = require("querystring");

module.exports = (args, req, res) => {

    var leagues = [ "mlb", "nba", "nfl", "nhl" ],
        league = args[0];

    if (leagues.indexOf(league) === -1) {

        res.writeHead(501, { "Content-Type" : "text/plain" });
        res.end("CANNOT GET " + league);

    } else {

        if (league === "nhl") {
            requestNhlGamesData((err, data) => {
                if (err) {
                    res.writeHead(500, { "Content-Type" : "text/plain" });
                    res.end("SERVER ERROR\n");
                } else {
                    res.writeHead(200, { "Content-Type" : "text/json",
                                         "Cache-Control" : "no-cache",
                                         "Access-Control-Allow-Origin": "*" });
                    res.end(JSON.stringify(data));
                }
            })
        } else {
            requestGamesData(league, (err, data) => {

                var decodeURIComponent = function (c) {
                        c = c.replace(/%(A|B|C)\w{1}(%20)+/,"");
                        return c.replace(/%20/g," ");
                    },
                    parseQueryString = function (qs) {
                        return queryString.parse(qs, null, null, { decodeURIComponent: decodeURIComponent });
                    },
                    games;

                if (err) {

                    res.writeHead(500, { "Content-Type" : "text/plain" });
                    res.end("SERVER ERROR\n");

                } else {
                    games = getGames(parseQueryString(data), league);

                    res.writeHead(200, { "Content-Type" : "text/json",
                                         "Cache-Control" : "no-cache",
                                         "Access-Control-Allow-Origin": "*" });
                    res.end(JSON.stringify(games));
                }
            });
        }
    }
};

function requestGamesData (league, cb) {
    var options = {
            hostname: "www.espn.com",
            path: "/" + league + "/bottomline/scores",
            method: "GET"
        },
        commonCallback = function (err, res, data) {
            if (err) { cb(err); return; }
            cb(null, data);
        };

    makeRequest(https, options, (err, res, data) => {
        if (res.statusCode == 302 && 
            res.headers.location && 
            res.headers.location.includes("http:")) {
            makeRequest(http, res.headers.location, commonCallback);
        } else {
            commonCallback(err, res, data);
        }
    });
}

function requestNhlGamesData(cb) {
    var options = {
            hostname: "statsapi.web.nhl.com",
            path: "/api/v1/schedule/games",
            method: "GET"
        },
        commonCallback = function (err, res, data) {
            if (err) { cb(err); return; }
            try {
                var games = [];
                var json = JSON.parse(data)
                if (json.dates && json.dates[0] && json.dates[0].games) {
                    json.dates[0].games.forEach((game) => {
                        games.push({
                            "headline" : game.teams.away.team.name + " vs. " + game.teams.home.team.name,
                            "link" : "https://statsapi.web.nhl.com" + game.link,
                            "lineCount": 0,
                        });
                    });
                }
                cb(null, games);
            } catch (exception) {
                cb(exception, null);
            }            
        };

    makeRequest(https, options, (err, res, data) => {
        if (res.statusCode == 302 && 
            res.headers.location && 
            res.headers.location.includes("http:")) {
            makeRequest(http, res.headers.location, commonCallback);
        } else {
            commonCallback(err, res, data);
        }
    });
}

function makeRequest (protocol, target, cb) {
    var req = protocol.request(target, (res) => {

        var data = "";

        res.setEncoding("utf8");

        res.on("data", (chunk) => {
            data += chunk;
        });

        res.on("end", () => {
            cb(null, res, data);
        });
    });

    req.on("error", (error) => {
        cb(error, res);
    });

    req.end();
}

function getGames (data, league) {
    var count,
        totalCount = parseInt(data[league + "_s_count"]),
        keys = Object.keys(data),
        games = [];

    for (count = 0; count < totalCount; count += 1) {

        (() => {

            var game = { _id: count + 1 },
                match = new RegExp("^" + league + "_s_(url|left|right)" + (count + 1).toString() + "(_|$)"),
                kIndex = 0,
                key;

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

        })();
    }
    return games;
}

function formatGame(game, league) {

    var formatted = {},
        id = game._id,
        count = parseInt(game[league + "_s_right" + id + "_count"]),
        i;

    for (i = 0; i < count; i += 1) {

        formatted["p" + (i + 1)] = game[league + "_s_right" + id + "_" + (i + 1)];
    }

    formatted.lineCount = count;
    formatted.headline = game[league + "_s_left" + id];
    formatted.link = game[league + "_s_url" + id];

    return formatted;
}
