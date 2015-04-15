var http = require("http"),
    qs = require("querystring"),
    options = {
        hostname: "sports.espn.go.com",
        path: "/mlb/bottomline/scores",
        port: 80,
        method: "GET"
    },
    req;

req = http.request(options, function (res) {

    var data = "";

    res.setEncoding("utf8");
    res.on("data", function (chunk) {
        data += chunk;
    });
    res.on("end", function () {
        var schedule = qs.parse(data, null, null, { decodeURIComponent: decodeURIComponent });
        var games = sortByGame(schedule);
    });
});

req.on("error", function (e) {
    console.log(e);
});

req.end();

function decodeURIComponent (c) {
    c = c.replace(/%[ABC][A-Z0-9](%20)+/g, ""); // special consideration for problematic line (has Outs)
    c = c.replace(/(%20){3}/g, " "); // line between teams / scores
    c = c.replace(/$%20/,""); // if the field leads with a space, delete it
    c = c.replace(/%20/g," ");
    return c;
}

function sortByGame(s) {

    var count,
        totalCount = parseInt(s["mlb_s_count"]),
        keys = Object.keys(s),
        keysByGame = [];

    for (count = 0; count < totalCount; count += 1) {

        (function () {

            var game = { _id: count },
                match,
                kIndex = 0,
                key;

            match = new RegExp("^mlb_s_(url|left|right)" + (count + 1).toString() + "(_|$)");

            while (kIndex < keys.length) {
                key = keys[kIndex];
                if (key.search(match) > -1) {
                    game[key] = s[key];
                    keys.splice(kIndex, 1);
                } else {
                    kIndex += 1;
                }
            }
            console.log(game);
            keysByGame.push(game);
        })()
    }
    return keysByGame;
}
