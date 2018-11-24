const {Stop, LatLongOrAndRouteSuggester} = require('../StopStorage');

test('Test LatLongOrAndRouteSuggester.suggest()', () => {
	start = new Stop(0,0);
	or_1 = [new Stop(1,0), new Stop(1,1)];
	or_2 = [new Stop(2,0)];
	end = new Stop(2,2);

	oars = new LatLongOrAndRouteSuggester();
	
	var result = oars.suggest(start, [or_1, or_2], end, 10000);
	expect(result).toEqual([
				[start, or_1[0], or_2[0], end],
				[start, or_1[1], or_2[0], end],
				[start, or_2[0], or_1[1], end],
				[start, or_2[0], or_1[0], end]
			       ]);
});
