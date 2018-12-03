const {Stop, GreedyLatLongOrAndRouteSuggester} = require('../StopStorage');

test('Test GreedyLatLongOrAndRouteSuggester.suggest()', () => {
	start = new Stop(0,0);
	or_1 = [new Stop(1,0), new Stop(1,1)];
	or_2 = [new Stop(2,0), new Stop(2,1)];
	end = new Stop(2,2);

	oars = new GreedyLatLongOrAndRouteSuggester();
	
	var result1 = oars.suggest(start, [or_1, or_2], end, 10000);
	expect(result1).toEqual([
				[start, or_1[1], or_2[1], end],
			       ]);
                   
    start = new Stop(0,0);
    B = [new Stop(1,0), new Stop(1,4), new Stop(3,4)];
    C = [new Stop(2,1), new Stop(2,3), new Stop(0,3)];
    D = [new Stop(1,7)];
    E = [new Stop(2,6), new Stop(1,5), new Stop(3,1), new Stop(1,1)];
    end = new Stop(3,7);
    
    var result2 = oars.suggest(start, [B,C,D,E], end, 10000);
    expect(result2).toEqual([
				[start, B[1], E[0], D[0], C[1], end],
			       ]);
                   
    var result3 = oars.calculate_worst_case_complexity([[]]);
    expect(result3).toEqual(0);
    
    var result4 = oars.calculate_worst_case_complexity([B,C,D,E]);
    expect(result4).toEqual(64);
});
