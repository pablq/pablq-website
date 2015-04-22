var def = require("./default"),
    sports = require("./sports");

module.exports = function (req, res) {
    
    var path;

    if (req.method !== "GET") {

        res.writeHead(501, { "Content-Type" : "text/plain" });
        res.end("CANNOT " + req.method + "\n");

    } else {

        path = req.url.match(/\w+/g);

        if (path[0] == "sports") {

            sports(path[1], req, res);

        } else {

            def(req, res);
        }
    }
}
