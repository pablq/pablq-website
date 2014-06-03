var http = require("http");
var path = require("path");
var fs = require("fs");

function requestHandler(req, res) {
    var filePath = "." + req.url;
    if (filePath == "./") {
        filePath = "./index.html";
    };
    var extname = path.extname(filePath);
    var contentType = "text/html";

    switch (extname) {
        case ".png":
            contentType = "image/png";
            break;
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
    }

    fs.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, function(err, content) {
                if (err) {
                    console.log("there was an error when serving file");
                    res.writeHead(500);
                    res.end();
                }
                else {
                    console.log("serving " + filePath);
                    res.writeHead(200, { "Content-Type" : contentType });
                    res.end(content);
                }
            });
        }
        else {
            console.log("file was not found");
            res.writeHead(404);
            res.end();
        }
    });
}

http.createServer(requestHandler).listen(5000);
console.log("listening on port 5000");
