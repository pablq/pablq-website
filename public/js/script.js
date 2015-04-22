(function(){
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
                console.log("done", xmlhttp.responseText);
            } else {
                console.log("status code: ", xmlhttp.status);
            }
        }
    }

    xmlhttp.open("GET", "README.txt", true);
    xmlhttp.send();
})()
