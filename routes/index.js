var url = require("url"), 
    def = require("./default"),
    sports = require("./sports");

module.exports = function (req, res) {
        
    var url; 
    if (req.method !== "GET") {

        res.writeHead(501, { "Content-Type" : "text/plain" });
        res.end("CANNOT " + req.method + "\n");

    } else {

        url = url.parse(req.url); 
        console.log(url);
    }
}
