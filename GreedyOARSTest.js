class Stop {
    /**
     * @param {String} lat Latitude of the Stop, or Yelp Fusion API json string
     * @param {Number} long Longitude of the stop, or undefined if using Yelp Fusion API
     */
    constructor(lat, long) {
        if (long === undefined) {
            this.latitude = JSON.parse(lat).coordinates.latitude;
            this.longitude = JSON.parse(lat).coordinates.longitude;
            this.info = JSON.parse(lat);
        }
        else {
            this.latitude = lat;
            this.longitude = long;
        }
    }

    getLatitude() {return this.latitude;}
    getLongitude() {return this.longitude;}
    getInfo() {return this.info;}
    
    /**
     * Calculate distance with `anotherStop` based on lat and long.
     * 
     * @param {Stop} anotherStop Another Stop
     * @returns {Number} Euclidean distance of lat and long
     */
    lat_long_distance(anotherStop) {
        return Math.sqrt(
            Math.pow(this.latitude - anotherStop.getLatitude(), 2) +
            Math.pow(this.longitude - anotherStop.getLongitude(), 2)
        );
    }
}

class OrAndRouteSuggester {
    /**
     * Abstract method that suggests routes - to be implemented by subclasses
     * Different subclasses will have different strategies to provide route suggestion
     *
     * @param {Stop} start_stop user pre-selected start of route
     * @param {Array.Array.Stop} or_and_stop_arr the list of all candidate stops grouped by category
     * @param {Stop} end_stop user pre-selected destination
     * @param {Number} max_num the number of route candidates to be returned
     *
     * @returns {Array.Array.Stop} - each Array.Stop in this var is a SUGGESTED route
     */
    suggest(start_stop, or_and_stop_arr, end_stop, max_num) {
      throw "OrAndRouteSuggester.suggest() is an abstract method. Call OrAndRouteSuggester's concrete subclass' suggest() instead.";
    }
  
    /**
     * Private method that generates all possible routes.
     *
     * @param  {Stop} start_stop - starting Stop
     * @param  {Array.Array.Stop} or_and_stop_arr - an Array of Array of stops. See documentation of class for example
     * @param  {Stop} end_stop - ending Stop
     *
     * @returns {Array.Array.Stop} - each Array.Stop in this var is a possible route
     */
    _get_all_possible_routes(start_stop, or_and_stop_arr, end_stop) {
      var possible_complete_routes = [];
      var or_and_stop_arr_perms = this._recursive_permutations(or_and_stop_arr);
      for (var i = 0; i < or_and_stop_arr_perms.length; i++) {
        var or_and_stop_arr_perm = or_and_stop_arr_perms[i];
        var possible_middle_routes = this._recursive_routes(or_and_stop_arr_perm);
  
        for (var j = 0; j < possible_middle_routes.length; j++) {
          var possible_complete_route = possible_middle_routes[j];
          possible_complete_route.unshift(start_stop);
          possible_complete_route.push(end_stop);
          possible_complete_routes.push(possible_complete_route);
        }
      }
      return possible_complete_routes;
    }
  
    /**
     * Private helper method for _get_all_possible_routes.
     * Get all possible permutations of the argument.
     * e.g. [[A,B],[C,D],[E],[F,G,H]] --> [[C,D],[A,B],[E],[F,G,H]]
     * is one possible permutation.
     *
     * @param {Array.Array.Stop} or_and_stop_arr an Array of Array of stops.
     * 
     * @returns {Array.Array.Stop} all permutations of Or/And Stop arrays
     */
    _recursive_permutations(or_and_stop_arr) {
      if (or_and_stop_arr.length == 0) {
        return [[]];
      }
  
      var results = [];
      for (var i = 0; i < or_and_stop_arr.length; i++) {
        var head = or_and_stop_arr[i];
        var sub_perms = this._recursive_permutations(
          or_and_stop_arr.slice(0, i).concat(or_and_stop_arr.slice(i + 1))
        );
        for (var j = 0; j < sub_perms.length; j++) {
          var sub_perm = sub_perms[j];
          results.push([head].concat(sub_perm));
        }
      }
      return results;
    }
  
    /**
     * Recursive helper function for _get_all_possible_routes.
     * Get all possible OR-AND route.
     * e.g. [[A,B],[C,D],[E],[F,G,H]] --> [A,C,E,G]
     * is one possible OR-AND route.
     *
     * @param {Array.Array.Stop} or_and_stop_arr an Array of Array of stops.
     *
     * @returns {Array.Array.Stop} get possible middle routes
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


class GreedyLatLongOrAndRouteSuggester extends OrAndRouteSuggester {
    /**
     * Public method suggest() calculates Euclidean distance among an array of
     * latitude and longitude coordinates. Different from 
     * `LatLongOrAndRouteSuggester` that uses brute force search in all the search space,
     * this class, `GreedyLatLongOrAndRouteSuggester`, uses a greedy approach.
     * 
     * The difference is best illustrated in the example below:
     * 
     * Start: A(0,0)
     * Or-1: B1(1,0), B2(1,1)
     * Or-2: C1(2,0), C2(2,1)
     * End: D(2,2)
     * 
     * Brute Force Search:
     * 1. Generate all possible routes and calculate lat-long distances:
     *     [A-B1-C1-D] with distance 4
     *     [A-B2-C1-D] with distance 4.83
     *     [A-B1-C2-D] with distance 3.41 <-- shortest!
     *     [A-B2-C2-D] with distance 3.41 <-- shortest!
     *     [A-C1-B1-D] with distance 5.24
     *     [A-C1-B2-D] with distance 4.83
     *     [A-C2-B1-D] with distance 5.89
     *     [A-C2-B2-D] with distance 4.65
     * 2. Choose the ones with shortest lat-long distance: [A-B1-C2-D] or [A-B2-C2-D]
     * 
     * Greedy Search:
     * 1. Try all possible stops and select the best one to add (Start and End are fixed)
     *     [A-B1-D] with distance 3.24 <-- shortest!
     *     [A-B2-D] with distance 2.83
     *     [A-C1-D] with distance 4
     *     [A-C2-D] with distance 3.24 <-- shortest!
     * 2. Choose the best one (Greedy!) for now: [A-B1-D] or [A-C2-D]
     * Let's pick [A-B1-D] (if multiple routes are shortest, pick one randomly)
     * 3. Repeat step 1 to add as second detour stop:
     *     [A-B1-C1-D] with distance 4
     *     [A-B1-C2-D] with distance 3.41 <-- shortest!
     * 4. So this algorithm will think [A-B1-C2-D] is the shortest one.
     * 
     * The brute force search is optimal if lat-long is perfect approximation of real world travelling.
     * Greedy search is obviously not optimal.
     * 
     * But greedy search has much shorter complexity.
     * 
     * Run-time analysis:
     * Assume there are `m` Or-lists.
     * Each or-list has `ni` length, where 1 <= 1 <= m.
     * Let `n_max` be `ni` with largest value.
     * 
     * Then, (run time is analyzed in terms of number of routes)
     * Worst case run time of brute force: O(m! * (n1*n2*...*nm)), exponential runtime
     * Worst case time of greedy search: O(m^2 * `n_max`), polynomial run time!
     * 
     *
     * @param {Stop} start_stop user pre-selected start of route 
     * @param {Array.Array.Stop} or_and_stop_arr the list of all candidate stops grouped by category 
     * @param {Stop} end_stop user pre-selected destination 
     * @param {Number} max_num the number of route candidates to be returned
     * 
     * @returns {Array.Array.Stop} - each Array.Stop in this var is a SUGGESTED route
     */
    suggest(start_stop, or_and_stop_arr, end_stop, max_num) {
        // TODO
        return "not done";
    }
}

start = new Stop(0,0);
or_1 = [new Stop(1,0), new Stop(1,1)];
or_2 = [new Stop(2,0), new Stop(2,1)];
end = new Stop(2,2);

oars = new GreedyLatLongOrAndRouteSuggester();
var result = oars.suggest(start, [or_1, or_2], end, 10000);
console.log(result);
