var http = require("http"),
    router = require("./router"),
    port = Number(process.env.PORT || 5000);

http.createServer(router).listen(port);
console.log("Listening on port:", port);
