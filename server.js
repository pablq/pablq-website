var http = require("http"),
    path = require("path"),
    fs = require("fs"),
    port = Number(process.env.PORT || 5000);

function requestHandler(req, res) {

    if (req.method !== "GET") {

        res.writeHead(501);
        res.end();

    } else {

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
            case ".txt":
                contentType = "text/plain";
                break;
            default:
                contentType = "text/html";
        }

        fs.exists(filePath, function(exists) {
            
            if (exists) {

                fs.readFile(filePath, function(err, content) {
                    
                    if (err) {
                        
                        res.writeHead(500, { "Content-Type" : "text/plain" });
                        res.end("server error");

                    } else {

                        res.writeHead(200, { "Content-Type" : contentType });
                        res.end(content);
                    }
                });

            } else {

                res.writeHead(404, { "Content-Type" : "text/plain" });
                res.end("file not found");
            }
        });
    }
}

http.createServer(requestHandler).listen(port);
console.log("listening on port:", port);
