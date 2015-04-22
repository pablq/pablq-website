var http = require("http"),
    router = require("./routes"),
    port = Number(process.env.PORT || 5000);

http.createServer(router).listen(port);
