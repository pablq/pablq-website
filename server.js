var http = require("http"),
    path = require("path"),
    fs = require("fs"),
    qs = require("querystring"),
    util = require("./util"),
    port = Number(process.env.PORT || 5000);

var requestHandler = function (req, res) {

    if (req.method !== "GET") {

        res.writeHead(501, { "Content-Type" : "text/plain" });
        res.end("CANNOT " + req.method + "\n");

    } else {
        
        if (req.url === "/") {

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
            
            (function(){

                var filePath = "." + req.url;
                var extname = path.extname(filePath);

                switch (extname) {
                    case ".gif":
                        contentType = "image/gif";
                        break;
                    case ".png":
                        contentType = "image/png";
                        break;
                    case ".js":
                        contentType = "text/javascript";
                        break;
                    case ".css":
                        contentType = "text/css";
                        break;
                    case ".txt":
                        contentType = "text/plain";
                        break;
                    case ".pdf":
                        contentType = "application/pdf";
                        break;
                    default:
                        contentType = "text/html";
                }

                fs.exists(filePath, function(exists) {
                    
                    if (exists) {

                        fs.readFile(filePath, function(err, content) {
                            
                            if (err) {
                                
                                res.writeHead(500, { "Content-Type" : "text/plain" });
                                res.end("SERVER ERROR\n");

                            } else {

                                res.writeHead(200, { "Content-Type" : contentType });
                                res.end(content);
                            }
                        });

                    } else {

                        res.writeHead(404, { "Content-Type" : "text/plain" });
                        res.end("FILE NOT FOUND\n");
                    }
                });
            })();
        }
    }
}

http.createServer(requestHandler).listen(port);
