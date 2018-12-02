const { StopRecommender } = require("../StopRecommender");
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

test('Test StopStorage API', done => {
    jest.setTimeout(10000);
    sr = new StopRecommender();

    function callback(suggestion) {
        suggestion.forEach(function (s) {
            console.log(s);
        })
        done();
    }
    var stops = [];
    stops.push(JSON.stringify({ "latitude": 34.063612, "longitude": - 118.449143 }));
    stops.push(JSON.stringify({ "latitude": 34.061630, "longitude": - 118.441622 }));
    sr.getStopSuggestion("424 Kelton Ave", stops, callback);
});