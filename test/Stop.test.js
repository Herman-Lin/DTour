const {Stop, OrAndRouteSuggester, LatLongOrAndRouteSuggester} = require('../StopStorage');

test('Test Stop.lat_long_distance()', () => {
	s1 = new Stop(0,0);
	s2 = new Stop(1,0);
	s3 = new Stop(2,2);
	
	var result1 = s1.lat_long_distance(s2);
	expect(result1).toEqual(1);

	var result2 = s2.lat_long_distance(s1);
	expect(result2).toEqual(1);

	var result3 = s3.lat_long_distance(s2);
	expect(result3).toEqual(Math.sqrt(5));
});
