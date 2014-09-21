var http = require("http");
var path = require("path");
var fs = require("fs");
var qs = require("querystring");

function requestHandler(req, res) {
  var filePath = "." + req.url;
  if (req.method === "POST" && filePath === "./comments.json") {
    fs.readFile(filePath, function (err, content) {
      if (err) {
        console.log("there was an error reading ./comments.json", err);
        res.writeHead(500);
        res.end();
      } else {
        var allComments = JSON.parse(content);
        var body = "";
        req.setEncoding("utf8");
        req.on("data", function (data) {
          body += data; 
        });
        req.on("end", function () {
          allComments.push(qs.parse(body));
          fs.writeFile("comments.json", JSON.stringify(allComments), function (err) {
            if (err) {
              console.log("there was an error writing comments.json", err); 
              res.writeHead(500);
              res.end();
            } else {
              res.writeHead(200);
              res.end();
            }
          });
        });
      }
    });
  } else if (req.method === "GET") {
    if (filePath === "./") {
      filePath = "./index.html";
    }
    var extname = path.extname(filePath);
    var contentType = "text/html";

    switch (extname) {
      case ".png":
        contentType = "image/png";
        break;
      case ".js":
        contentType = "text/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
    }

    fs.exists(filePath, function(exists) {
      if (exists) {
        fs.readFile(filePath, function(err, content) {
          if (err) {
            console.log("there was an error when serving file");
            res.writeHead(500);
            res.end();
          }
          else {
            console.log("serving " + filePath);
            res.writeHead(200, { "Content-Type" : contentType });
            res.end(content);
          }
        });
      } else {
        console.log("file was not found");
        res.writeHead(404);
        res.end();
      }
    });
  } else {
    res.writeHead(406);
    res.end();
  }
}

var port = Number(process.env.PORT || 5000);

http.createServer(requestHandler).listen(port);
console.log("listening on port "+ port);
