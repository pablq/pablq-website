
            // home url gets dynamic baseball html
            // home url gets dynamic baseball html
            (function() {
                var options = {
                        hostname: "sports.espn.go.com",
                        path: "/mlb/bottomline/scores",
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
                        var schedule = qs.parse(data, null, null, { decodeURIComponent: util.parseComponentFn }),
                            games = util.getGames(schedule),
                            html = util.getHTML(games);

                        res.writeHead(200, { "Content-Type" : "text/html" });
                        res.end(html);
                    });
                });

                gameReq.on("error", function (e) {
                    res.writeHead(500, { "Content-Type" : "text/plain" });
                    res.end("SERVER ERROR\n");
                });

                gameReq.end();

            }());

        } else {
        */
            
            // otherwise, server just sends files. 
            (function() {
                var options = {
                        hostname: "sports.espn.go.com",
                        path: "/mlb/bottomline/scores",
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
                        var schedule = qs.parse(data, null, null, { decodeURIComponent: util.parseComponentFn }),
                            games = util.getGames(schedule),
                            html = util.getHTML(games);

                        res.writeHead(200, { "Content-Type" : "text/html" });
                        res.end(html);
                    });
                });

                gameReq.on("error", function (e) {
                    res.writeHead(500, { "Content-Type" : "text/plain" });
                    res.end("SERVER ERROR\n");
                });

                gameReq.end();

            }());

        } else {
        */
            
            // otherwise, server just sends files. 
