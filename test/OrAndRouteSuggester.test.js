const {Stop, OrAndRouteSuggester} = require('../StopStorage');

test('Test OrAndRouteSuggester._get_all_possible_routes()', () => {
	start = new Stop(0,0);
	or_1 = [new Stop(1,0), new Stop(1,1)];
	or_2 = [new Stop(2,0)];
	end = new Stop(2,2);
	
	oars = new OrAndRouteSuggester();

	var result1 = oars._get_all_possible_routes(start,[or_1],end);
	expect(result1).toEqual([[start, or_1[0], end], [start, or_1[1], end]]);

	var result2 = oars._get_all_possible_routes(start,[or_2],end);
	expect(result2).toEqual([[start, or_2[0], end]]);

	var result3 = oars._get_all_possible_routes(start,[or_1, or_2],end);
	expect(result3).toEqual([[start, or_1[0], or_2[0], end], [start, or_1[1], or_2[0], end],
				 [start, or_2[0], or_1[0], end], [start, or_2[0], or_1[1], end]
				]);
});


