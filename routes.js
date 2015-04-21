var http = require("http"),
    qs = require("querystring"),
    util = require("./util.js");

(function () {
    var paths = [ "/mlb/bottomline/scores", "/nfl/bottomline/scores", "/nba/bottomline/scores","/nhl/bottomline/scores" ];

    for (var i = 0, len = paths.length; i < len; i += 1) {
        (function(index) {
            var options = {
                    hostname: "sports.espn.go.com",
                    path: paths[index],
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
                    //var schedule = qs.parse(data, null, null, { decodeURIComponent: util.parseComponentFn }),
                    var schedule = qs.parse(data),
                        games = util.getGames(schedule, paths[index].split("/")[1]);

                    console.log(paths[index].split("/")[1] + ":");
                    console.log(games);
                });
            });

            gameReq.on("error", function (e) {
            });

            gameReq.end();

        }(i));
    }
})()
