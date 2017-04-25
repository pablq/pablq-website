var publicFuncs = (function () {

    "use strict";

    var visible = false;

    function toggleVisibility() {

        var elm = document.getElementById("container");

        if (elm.style.visibility === "hidden") {
            elm.style.opacity = 1;
            elm.style.visibility = "visible";
        } else {
            elm.style.opacity = 0;
            elm.style.visibility = "hidden";
        }
        visible = !visible;
    }

    function requestGames(league, cb) {

        var xmlhttp;

        if (window.XMLHttpRequest) {
            // for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest({mozAnon: true});
        } else {
            // for IE6, IE5
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        xmlhttp.onreadystatechange = function () {

            if (xmlhttp.readyState === XMLHttpRequest.DONE) {
                if (xmlhttp.status === 200) {
                    // success! pass null error
                    cb(null, JSON.parse(xmlhttp.responseText));
                } else {
                    // pass status as the error
                    cb(xmlhttp.status);
                }
            }
        };

        if (xmlhttp) {
            xmlhttp.open("GET", "/sports/" + league, true);
            xmlhttp.send();
        }
    }

    function deleteChildNodes(node) {
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }
    }

    function buildHtml(data, fail) {

        var games = document.getElementById("games"),
            game,
            li,
            link,
            headline,
            p,
            i,
            len,
            j;

        deleteChildNodes(games);
        
        if (fail) {
            
            li = document.createElement("li");
            li.appendChild(document.createTextNode("Sorry, there was a problem. :("));
            games.appendChild(li);
            
        } else if (data && data.length) {

            for (i = 0, len = data.length; i < len; i += 1) {
                game = data[i];

                li = document.createElement("li");
                link = document.createElement("a");
                headline = document.createTextNode(game.headline);

                if (game.headline.search("Chicago") > -1) {
                    li.setAttribute("class", "chicago");
                }
                link.setAttribute("href", game.link);
                link.setAttribute("target", "_blank");
                link.appendChild(headline);
                link.appendChild(document.createElement("br"));

                for (j = 0; j < game.lineCount; j += 1) {
                    p = document.createTextNode(game["p" + (j + 1)]);
                    link.appendChild(p);
                    link.appendChild(document.createElement("br"));
                }
                li.appendChild(link);
                games.appendChild(li);
            }

        } else {

            li = document.createElement("li");
            li.appendChild(document.createTextNode("Sorry, couldn't find any games today. :)"));
            li.style.padding = "25px";
            games.appendChild(li);
        }
    }

    function close() {
        if (visible) {
            toggleVisibility();
        }
    }

    function init() {
        /* set click listener to close view of games */
        document.getElementById("invisible_close_button").addEventListener("click", close);
    }

    function show(league) {
        requestGames(league, function (error, games) {
            // buildHtml handles failed requests
            buildHtml(games, error);

            if (!visible) {
                toggleVisibility();
            }
        });
    }

    return {
        show: show,
        init: init
    };

}());

publicFuncs.init();
