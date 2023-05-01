module.exports = (() => {

    "use strict";

    var getStatic = require("./getStatic"),
        getSports = require("./getSports"),
        routes = {
            def: getStatic,
            sports: getSports
        };

    return (req, res) => {

        if (req.headers["x-forwarded-proto"] !== "https") {
            res.writeHead(301, {
                "Location": "https://" + req.headers.host + req.url
            });
            res.end("Moved Permanently\n");
            return;
        }

        if (req.method !== "GET") {
            res.writeHead(501, { "Content-Type": "text/plain" });
            res.end("CANNOT " + req.method + "\n");
            return;
        }

        var path = req.url.match(/\w+/g);
        if (path && routes[path[0]]) {
            routes[path[0]](path.slice(1), req, res);
        } else {
            routes["def"](req, res);
        }
    };
})();
