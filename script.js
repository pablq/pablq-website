var http = require("http"),
    qs = require("querystring");

var options = {
        hostname: "sports.espn.go.com",
        path: "/mlb/bottomline/scores",
        port: 80,
        method: "GET"
    };

var req = http.request(options, function (res) {
    var data = "";

    console.log(res.statusCode, res.statusMessage); 
    res.setEncoding("utf8");
    res.on("data", function (chunk) {
        data += chunk;
    });
    res.on("end", function () {
        var schedule = qs.parse(data, null, null, { decodeURIComponent: decodeURIComponent });
        formatSchedule(schedule);
    });
});

req.on("error", function (e) {
    console.log("problem with request: " + e.message);
});

req.end();

function decodeURIComponent (c) {
    c = c.replace(/%[ABC][A-Z0-9](%20)+/g, ""); // special consideration for problematic line (with outs)
    c = c.replace(/(%20){3}/g, ", "); // line between teams / scores
    c = c.replace(/$%20/,""); // if the field leads with a space, delete it
    c = c.replace(/%20/g," ");
    return c;
}

function formatSchedule(s) {
    if (s["mlb_s_loaded"]) {
        setKeys(s);        
    }
}

function setKeys(s) {
    var count = parseInt(s["mlb_s_count"]),
        keys = Object.keys(s);
    
    for (var i = 0, len = keys.length; i < len; i += 1) { 
        
        console.log("key:");
        console.log(keys[i]);
        console.log("val:");
        console.log(s[keys[i]]);
    }  
}
