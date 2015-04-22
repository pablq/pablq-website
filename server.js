var http = require("http"),
    path = require("path"),
    fs = require("fs"),
    router = require("./routes"),
    port = Number(process.env.PORT || 5000);

http.createServer(router).listen(port);
