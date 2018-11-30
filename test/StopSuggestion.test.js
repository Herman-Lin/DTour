const { StopSuggestion } = require('../StopSuggestion');
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

test('Test StopSuggestion', done => {
    jest.setTimeout(10000);
	ss = new StopSuggestion();
	var stops = [{latitude: 34.0689, longitude: 118.4452}, {latitude: 33.9416, longitude: 118.4085}]
	//ss.generate_stops(stops, "food");
	ss.yelp_request("In n out", 34.0689, 118.4452, 180)
});

