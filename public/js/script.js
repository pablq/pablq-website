var public_funcs = (function () {

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
                if (xmlhttp.status === 200) {
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

    function buildHtml(data) {

        var games = document.getElementById("games"),
            item,
            li,
            link,
            headline,
            p;

        deleteChildNodes(games);
        
        if (data && data.length) {

            for (var i = 0, len = data.length; i < len; i += 1) {
            
                item = data[i];
                console.log(item);

                li = document.createElement("li"),
                link = document.createElement("a"),
                headline = document.createTextNode(item.headline);
                
                if (item.headline.search("Chicago") > -1) {
                    li.setAttribute("class","chicago");
                }
                link.setAttribute("href", item.link);
                link.setAttribute("target", "_blank");
                link.appendChild(headline);
                link.appendChild(document.createElement("br"));

                for (var j = 0; j < item.lineCount; j += 1) {
                    p = document.createTextNode(item["p" + (j + 1)]);
                    link.appendChild(p);
                    link.appendChild(document.createElement("br"));
                }
                li.appendChild(link);
                games.appendChild(li);
            }

        } else {

            li = document.createElement("li");
            li.appendChild(document.createTextNode("Sorry, there was a problem. :("));
            games.appendChild(li);
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

    function init() {
        /* set background images */
        var ids_w_type = [
                { id: "button1", type: "button" },
                { id: "button2", type: "button" },
                { id: "button3", type: "button" },
                { id: "button4", type: "button" },
                { id: "container" },
            ],
            item,
            images;
            
        for (var i = 0, len = ids_w_type.length; i < len; i += 1) {
            item = ids_w_type[i];
            if (item.type === "button") {
                images = createButtonImageStrings();
            } else {
                images = createBackgroundImageStrings();
            }
            url = images[getRandInRange(0, images.length - 1)];
            setBackgroundImage(item.id, url);
        }

        images = createBodyBackgroundImageStrings();
        document.body.style.backgroundImage = images[getRandInRange(0,images.length)];

        /* set click listener to close view of games */
        document.getElementById("invisible_close_button").addEventListener("click", close);
    }

    function show(league) { 

        requestGames(league, function (error, games) {

            // buildHtml handles failed requests
            buildHtml(games);

            if (!visible) {
                toggleVisibility();
            }
        });
    }

    function setBackgroundImage(id, url) {
        var elm = document.getElementById(id);
        elm.style.backgroundImage = "url(" + url + ")";
    }

    function createButtonImageStrings() {
        var buttonImageStrings = [];
        for (var n = 1; n <= 22; n += 1) {
            buttonImageStrings.push("/img/button_backgrounds/" + n + ".jpg");
        }
        return buttonImageStrings;
    }

    function createBackgroundImageStrings() {
        var backgroundImageStrings = [];
        for (var n = 1; n <= 22; n += 1) {
            backgroundImageStrings.push("/img/backgrounds/" + n + "-pos.png");
        }
        return backgroundImageStrings;
    }

    function createBodyBackgroundImageStrings() {
        var bodyBackgroundImageStrings = [];
        for (var n = 1; n <= 22; n += 1) {
            bodyBackgroundImageStrings.push("url(/img/backgrounds/" + n + "-pos.png), linear-gradient(to bottom right, white, gray, black)");
        }
        return bodyBackgroundImageStrings;
    }

    function getRandInRange(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function setBackgroundImages(ids_with_type) {
        var id_with_type,
            images,
            url;

        for (var i = 0, len = ids_with_type.length; i < len; i += 1) {
            
            id_with_type = ids_with_type[i];
            if (id_with_type.type === "button") {
                images = createButtonImageStrings();
            } else {
                images = createBackgroundImageStrings();
            }
            url = images[getRandInRange(0, images.length - 1)];
            setBackgroundImage(id_with_type.id, url);
        }
    }

    return {
        show: show,
        init: init
    }

}());

public_funcs.init();
