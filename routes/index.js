var handleStatic = require("./default"),
    handleSports = require("./sports");

module.exports = function (req, res) {
    
    var path;

    if (req.method !== "GET") {

        res.writeHead(501, { "Content-Type" : "text/plain" });
        res.end("CANNOT " + req.method + "\n");

    } else {
        
        path = req.url.match(/\w+/g);

        if (path && path[0] === "sports") {

            handleSports(path[1], req, res);

        } else {

            handleStatic(req, res);
        }
    }
}
