var http = require("http"),
    path = require("path"),
    fs = require("fs");

module.exports = function (req, res) {

    var filePath,
        _dir = "./frontend",
        getContentType = function (filePath) {
            var extentions = {
                    gif : "image/gif",
                    png : "image/gif",
                    js  : "text/javascript",
                    css : "text/css",
                    pdf : "application/pdf",
                    html: "text/html"
                },
                ext = path.extname(filePath).replace(".","");
            
            return exts[ext] ? exts[ext] : "unknown";
        };

    if (req.url === "/")
        filePath = _dir + "/index.html";
    else
        filePath = _dir + req.url;

    fs.exists(filePath, function(exists) {
        
        if (exists) {

            fs.readFile(filePath, function(err, content) {
                
                if (err) {
                    
                    res.writeHead(500, { "Content-Type" : "text/plain" });
                    res.end("SERVER ERROR\n");

                } else {

                    res.writeHead(200, { "Content-Type" : getContentType(filePath) });
                    res.end(content);
                }
            });

        } else {

            res.writeHead(404, { "Content-Type" : "text/plain" });
            res.end("FILE NOT FOUND\n");
        }
    });
}
