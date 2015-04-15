var http = require("http"),
    qs = require("querystring"),
    util = require("./util");

(function(){
    var options = {
            hostname: "sports.espn.go.com",
            path: "/mlb/bottomline/scores",
            port: 80,
            method: "GET"
        },
        req,
        result;

    req = http.request(options, function (res) {

        var data = "";
        res.setEncoding("utf8");
        res.on("data", function (chunk) {
            data += chunk;
        });
        res.on("end", function () {
            var schedule = qs.parse(data, null, null, { decodeURIComponent: util.parseComponentFn });
            console.log(util.sortFn(schedule));
        });
    });

    req.on("error", function (e) {
        return null;
    });

    req.end();

}());
