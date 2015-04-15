module.exports = (function(){ 

    function parseComponentFn (c) {
        c = c.replace(/%[ABC][A-Z0-9](%20)+/g, ""); // special consideration for problematic line (has Outs)
        c = c.replace(/(%20){3}/g, " "); // line between teams / scores
        c = c.replace(/%20/g," "); // replace spaces
        return c;
    };
    
    function sortFn (data) {

        var count,
            totalCount = parseInt(data["mlb_s_count"]),
            keys = Object.keys(data),
            games = [];

        for (count = 0; count < totalCount; count += 1) {

            (function () {

                var game = { _id: count + 1 },
                    match,
                    kIndex = 0,
                    key;

                match = new RegExp("^mlb_s_(url|left|right)" + (count + 1).toString() + "(_|$)");

                while (kIndex < keys.length) {
                    key = keys[kIndex];
                    if (key.search(match) > -1) {
                        game[key] = data[key];
                        keys.splice(kIndex, 1);
                    } else {
                        kIndex += 1;
                    }
                }
                games.push(toLines(game));
            })()
        }
        return games;
    }
    
    /* expected keys: {
            _id: <id>
            mlb_s_left<id>: <pregame: teams and time> or <ingame: teams, scores, and inning> or <postgame: final score>
            mlb_s_right<id>_count: how many mlb_s_right<id>_n tags are there? number
            mlb_s_right<id>_1: (only present when count > 0) <pregame: pitching matchup> <ingame: outs> <postgame: pitching scorers>
            mlb_s_url<id>: url for live gamecast
        }
    */

    function toLines(game) {

        var lines = {},
            id = game._id;
        
        lines.headline = game["mlb_s_left" + id];
        
        var count = parseInt(game["mlb_s_right" + id + "_count"]);
        for (var i = 0; i < count; i += 1) {
            lines["p" + count] = game["mlb_s_right" + id + "_" + count];
        }
        lines.link = game["mlb_s_url" + id];
        return lines;
    }
    
    /*function writeGameFn(game) {
        var keys = Object.keys(game),
            
            
    }*/
    return {
        parseComponentFn: parseComponentFn,
        sortFn: sortFn
    }
})()
