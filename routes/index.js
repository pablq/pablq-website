var getStatic = require("./getStatic"),
    getSports = require("./getSports");

module.exports = (req, res) => {
    
    var path, 
        routes = {
            sports: getSports,
            default: getStatic
        };

    if (req.method !== "GET") {

        res.writeHead(501, { "Content-Type" : "text/plain" });
        res.end("CANNOT " + req.method + "\n");

    } else {
        
        path = req.url.match(/\w+/g);

        if (path && routes[path[0]]) {
        
            routes[path[0]](path.slice(1), req, res);

        } else {

            routes["default"](req, res);
        }
    }
}
