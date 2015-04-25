var functions = (function () {

    var allGames = {
            mlb: [],
            nhl: [],
            nfl: [],
            nba: []
        },
        leagues = Object.keys(allGames),
        current_league,
        visible = false;

    function toggleVisibility() {

        var elm = document.getElementById("container");

        if (elm.style.visibility === "hidden")
            elm.style.visibility = "visible";
        else
            elm.style.visibility = "hidden";
        
        visible = !visible;
    }

    function requestGames(league, cb) {

        var xmlhttp,
            _id = Math.floor(Math.random() * 100);

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
                    // success! pass null error
                    cb(null, JSON.parse(xmlhttp.responseText));
                } else {
                    // pass status as the error
                    cb(xmlhttp.status);
                }
            }
        }

        xmlhttp.open("GET", "/sports/" + league, true);
        xmlhttp.send();
    }

    function buildHtml(games) {

        var gamesList = document.getElementById("games");

        deleteChildNodes(gamesList);

        for (var i = 0, len = games.length; i < len; i += 1) {
            var game = document.createElement("li"),
                link = document.createElement("a"),
                headline = document.createTextNode(games[i].headline),
                p;

            game.setAttribute("class","game");

            link.setAttribute("href", games[i].link);
            link.setAttribute("target", "_blank");

            link.appendChild(headline);
            link.appendChild(document.createElement("br"));

            for (var j = 0; j < games[i].lineCount; j += 1) {
                p = document.createTextNode(games[i]["p" + (j + 1)]);
                link.appendChild(p);
                link.appendChild(document.createElement("br"));
            }
            game.appendChild(link);
            gamesList.appendChild(game);
        }
        
    }

    function deleteChildNodes(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function close () {
        if (visible) {
            toggleVisibility();
        }
    }

    function refresh() {
        var league = current_league;
        requestGames(league, function (error, games) {
            if (!error) {
                allGames[league] = games;
                show(league);
            }
        });
    }
    
    function init() {
        var i,
            len,
            league;

        for (i = 0, len = leagues.length; i < len; i += 1) {
            (function (index) {
                var league = leagues[index];
                requestGames(league, function (error, games) {
                    if (!error) {
                        console.log("setting " + league + " to " + games);
                        allGames[league] = games;
                    }
                });
            })(i)
        }
    }

    function show(league) { 

        current_league = league;

        buildHtml(allGames[league]);
        
        console.log("show!");

        if (!visible) {
            toggleVisibility();
        }
    }

    return {
        show: show,
        close: close,
        refresh: refresh,
        init: init
    }

}());

window.onload = functions.init;
