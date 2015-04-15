var util = require("./util");

module.exports = function (games) {
    
    var i, len, 
        html = "<html><head><title>Today's Games</title>" +
               "<link rel='stylesheet' type='text/css' href='/css/style.css'>" +
               "<meta name='description' content='Dynamically Generated'>" +
               "<meta name='author' content='pablq'>" +
               "<meta charset='UTF-8'></head>";
    
    for (i = 0, len = game.length; i < len; i += 1) {
        html += util.gameToHTML(games[i]);
    }
    
    html += "<br/><a href='https://github.com/pablq'>https://github.com/pablq</a>" +
            "</body></html>";
    
    return html;
}
