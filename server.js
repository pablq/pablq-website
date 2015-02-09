var http = require("http"),
    path = require("path"),
    fs = require("fs"),
    port = Number(process.env.PORT || 5000);

function requestHandler(req, res) {

    var filePath = "." + req.url;

    if (filePath === "./") {
      filePath = "./index.html";
    }

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
        default:
            contentType = "text/html";
    }

    fs.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, function(err, content) {
                if (err) {
                    res.writeHead(500);
                    res.end();
                } else {
                    res.writeHead(200, { "Content-Type" : contentType });
                    res.end(content);
                }
            });
        } else {
            res.writeHead(404);
            res.end();
        }
    });
}

http.createServer(requestHandler).listen(port);
console.log("listening on port:", port);
