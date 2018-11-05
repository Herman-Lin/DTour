/**
 * Stop is a class that encapsulates stop.
 * 
 * Currently it only encapsulates latitude and longitude.
 * 
 */
class Stop {
    constructor(lat, long) {
        this.lat = lat
        this.long = long
    }

    /**
     * Calculate distance with `another_stop` based on lat and long.
     * 
     * @param {Stop} another_stop 
     * @returns {Number} Euclidean distance of lat and long
     */
    lat_long_distance(another_stop) {
        return Math.sqrt(
                Math.pow(this.lat-another_stop.lat,2) +
                Math.pow(this.long-another_stop.long,2)
        );
    }
}

/**
 * This class uses a Strategy pattern.
 * 
 * OrAndRouteSuggester is a class that can suggest routes
 * based on list of stops in OR-AND format users want to visit.
 * 
 * e.g. [[A,B],[C,D],[E],[F,G,H]]
 * will generate good route candidates (suggests) that
 * goes to A or B, then C or D, then E, then F or G or H,
 * hence the name OrAndRouteSuggester.
 * 
 * A suggestion is an Array of Array that look like this:
 * [
 * [A,C,E,F],
 * [A,D,E,F],
 * [B,C,E,G],
 * ...
 * ]
 * the top one is the most recommended one.
 * 
 * Different subclasses have different algorithms
 * for suggesting posible routes.
 * 
 * Using ES6 class sugar syntax.
 * 
 * @param  {} strategy
 */
 class OrAndRouteSuggester {
    /**
     * @param  {Stop} start_stop - starting Stop
     * @param  {Array.Array.Stop} or_and_stop_arr - an Array of Array of stops. e.g. [[A,B],[C,D],[E],[F,G,H]]
     * @param  {Stop} end_stop - ending Stop
     * @param  {Number} max_num - maximum number of routes to suggest
     * 
     * @returns {Array.Array.Stop} - each Array.Stop in this var is a SUGGESTED route
     */ 
    suggest(start_stop, or_and_stop_arr, end_stop, max_num) {
        throw "OrAndRouteSuggester.suggest() is an abstract method. Call OrAndRouteSuggester's concrete subclass' suggest() instead."
    }

    /**
     * @param  {Stop} start_stop - starting Stop
     * @param  {Array.Array.Stop} or_and_stop_arr - an Array of Array of stops. See documentation of OrAndRouteSuggester for an example
     * @param  {Stop} end_stop - ending Stop
     * 
     * @returns {Array.Array.Stop} - each Array.Stop in this var is a possible route
     */
    _get_all_possible_routes(start_stop,or_and_stop_arr,end_stop) {
        var possible_middle_routes = this._recursive_routes(or_and_stop_arr);
        var possible_complete_routes = [];
        for (var i = 0; i < possible_middle_routes.length; i++) {
            var possible_complete_route = possible_middle_routes[i];
            possible_complete_route.unshift(start_stop)
            possible_complete_route.push(end_stop)

            possible_complete_routes.push(possible_complete_route)
        }
        return possible_complete_routes
    }

    /**
     * Supposedly private helper function for _get_all_possible_routes.
     * 
     */
    _recursive_routes(or_and_stop_arr) {
        if (or_and_stop_arr.length == 0) {
            return [[]];
        }

        var results = [];
        var first_or_list = or_and_stop_arr[0];
        for (var i = 0; i < first_or_list.length; i++) {
            var each_or_stop = first_or_list[i];
            var sub_routes = this._recursive_routes(or_and_stop_arr.slice(1));

            for (var j = 0; j < sub_routes.length; j++) {
                var sub_route = sub_routes[j];
                results.push([each_or_stop].concat(sub_route));
            }
        }

        return results;
    }
 }

/**
  * LatLongOrAndRouteSuggester is an implementation of the abstract
  * strategy OrAndRouteSuggester.
  * 
  * suggest() calculates lat long distances between 
  * all stops for each possible route, and return
  * top `max_num` number of routes to suggest.
  * 
  */
class LatLongOrAndRouteSuggester extends OrAndRouteSuggester {
    suggest(start_stop, or_and_stop_arr, end_stop, max_num) {
        var all_possible_routes = super._get_all_possible_routes(start_stop, or_and_stop_arr, end_stop);
        
        var all_possible_dis = new Array(all_possible_routes.length)
        for (var i = 0; i < all_possible_dis.length; i++) {
            all_possible_dis[i] = this._calculate_length_of_route(all_possible_routes[i]);
        }
        
        var indices = new Array(all_possible_routes.length)
        for (var i = 0; i < indices.length; i++) {
            indices[i] = i;
        }
        
        indices.sort(function (a,b) {return all_possible_dis[a] < all_possible_dis[b] ? -1 : all_possible_dis[a] > all_possible_dis[b] ? 1 : 0; })
        
        var suggested_routes_sorted_by_dis = new Array(Math.min(all_possible_routes.length,max_num));
        for (var i = 0; i < indices.length && i < max_num; i++) {
            console.log(all_possible_dis[indices[i]]);
            suggested_routes_sorted_by_dis[i] = all_possible_routes[indices[i]];
        }

        return suggested_routes_sorted_by_dis;
    }

    /**
     * 
     * @param {Array.Stop} route
     * @returns {Number} 
     */
    _calculate_length_of_route(route) {
        var total_len = 0;
        for (var i = 0; i < route.length - 1; i++) {
            total_len += route[i].lat_long_distance(route[i+1])
        }
        return total_len
    }
}

/**
 * Joke strategy, not worth it to implement it.
 */
class RandomOrAndRouteSuggester extends OrAndRouteSuggester {
    suggest(start_stop, or_and_stop_arr, end_stop, max_num) {
        throw "not implemented yet."
    }
}



start = new Stop(34.0704,118.4442); // Ackerman Union
or_1 = [new Stop(34.0728,118.4422)]; // Royce Hall
or_2 = [new Stop(34.0696,118.4429), new Stop(34.0716,118.4422), new Stop(34.0750,118.4415)]; // Math Science, Powell Library, YRL
end = new Stop(34.0704,118.4442); // Ackerman Union

console.log("Lat Long Route Suggester:")
oars = new LatLongOrAndRouteSuggester();
console.log(oars.suggest(start, [or_1, or_2], end, 2));

console.log("Random Route Suggester:")
oars = new RandomOrAndRouteSuggester();
console.log(oars.suggest(start, [or_1, or_2], end, 2));