var sports = ["mlb", "nhl", "nfl", "nba"];

for (var i = 0, len = sports.length; i < len; i += 1) {
    getSportForTag(sports[i], sports[i] + "_tag");
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
                console.log("update " + tag + " with:"); 
                console.log(JSON.parse(xmlhttp.responseText));

            } else {
                console.log("status code: ", xmlhttp.status);
            }
        }
    }

    xmlhttp.open("GET", "/sports/" + sport, true);
    xmlhttp.send();
}
