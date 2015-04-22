window.onload = function () {
    var sports = ["mlb", "nhl", "nfl", "nba"];
    for (var i = 0, len = sports.length; i < len; i += 1) {
        console.log(sports[i]);
        getSportForTag(sports[i], sports[i] + "_container");
    }
}

function showSport(sport) {
    var element = document.getElementById(sport + "_container");
    console.log(element);
    if (element.style.display === "none")
        element.style.display = "block";
    else
        element.style.display = "none";
}

function getSportForTag(sport, tag) {
    
    var xmlhttp;
    if (window.XMLHttpRequest) {
        // for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
    } else {
        // for IE6, IE5
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    
    xmlhttp.onreadystatechange = function () {

        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
            if (xmlhttp.status = 200) {
                buildSection(tag, JSON.parse(xmlhttp.responseText));
            } else {
                // problems...
                console.log("status code: ", xmlhttp.status);
            }
        }
    }

    xmlhttp.open("GET", "/sports/" + sport, true);
    xmlhttp.send();
}

function buildSection(tag, games) {
    var container = document.getElementById(tag);
    console.log(container);
    for (var i = 0, len = games.length; i < len; i += 1) {
        var game = document.createElement("div"),
            headline = document.createElement("h3"),
            p;

        headline.innerHTML = games[i].headline;
        game.appendChild(headline);

        for (var j = 0; j < games[i].lineCount; j += 1) {
            p = document.createTextNode(games[i]["p" + (j + 1)]);
            game.appendChild(p);
        }
        container.appendChild(game);
    }
}
