

start = new Stop(0,0);
or_1 = [new Stop(1,0), new Stop(1,1)];
or_2 = [new Stop(2,0), new Stop(2,1)];
end = new Stop(2,2);

oars = new GreedyLatLongOrAndRouteSuggester();
var result = oars.suggest(start, [or_1, or_2], end, 10000);
console.log("=======================")
console.log(result);
console.log("=======================")
console.log("=======================")
console.log("=======================")

start = new Stop(0,0);
B = [new Stop(1,0), new Stop(1,4), new Stop(3,4)];
C = [new Stop(2,1), new Stop(2,3), new Stop(0,3)];
D = [new Stop(1,7)];
E = [new Stop(2,6), new Stop(1,5), new Stop(3,1), new Stop(1,1)];
end = new Stop(3,7);

oars = new GreedyLatLongOrAndRouteSuggester();
var result = oars.suggest(start, [B,C,D,E], end, 10000);
console.log("=======================GREEDY=======================")
console.log(result[0]);
console.log(oars._calculate_length_of_route(result[0]));
console.log(oars.calculate_worst_case_complexity([or_1, or_2]));
console.log(oars.calculate_worst_case_complexity([B,C,D,E]));

optimal_oars = new LatLongOrAndRouteSuggester();
var result = optimal_oars.suggest(start, [B,C,D,E], end, 10000);
console.log("=======================OPTIMAL=======================")
console.log(result[0]);
console.log(optimal_oars._calculate_length_of_route(result[0]));
console.log(optimal_oars.calculate_worst_case_complexity([or_1, or_2]));
console.log(optimal_oars.calculate_worst_case_complexity([B,C,D,E]));


console.log("=======================(all above are like 0.2s) TESTING HOW TIME CONSUMING BRUTAL IS=======================")
start = new Stop(0,0);
B = [new Stop(2,6), new Stop(1,5), new Stop(3,1), new Stop(1,1), new Stop(2,6), new Stop(1,5), new Stop(3,1), new Stop(1,1)];
C = [new Stop(2,6), new Stop(1,5), new Stop(3,1), new Stop(1,1), new Stop(2,6), new Stop(1,5), new Stop(3,1), new Stop(1,1)];
D = [new Stop(2,6), new Stop(1,5), new Stop(3,1), new Stop(1,1), new Stop(2,6), new Stop(1,5), new Stop(3,1), new Stop(1,1)];
E = [new Stop(2,6), new Stop(1,5)];
end = new Stop(3,7);
console.log(optimal_oars.calculate_worst_case_complexity([B,C,D,E]));
var result = optimal_oars.suggest(start, [B,C,D,E], end, 10000);
console.log(optimal_oars._calculate_length_of_route(result[0]));