module.exports = (() => {

    "use strict";

    var getStatic = require("./getStatic"),
        getSports = require("./getSports"),
        routes = {
            def: getStatic,
            sports: getSports
        };

    return (req, res) => {
    
        var path;

        if (req.method !== "GET") {

            res.writeHead(501, { "Content-Type" : "text/plain" });
            res.end("CANNOT " + req.method + "\n");

        } else {
            
            path = req.url.match(/\w+/g);

            if (path && routes[path[0]])
                routes[path[0]](path.slice(1), req, res);
            else
                routes["def"](req, res);
        }
    };
})();
