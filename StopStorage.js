/**
 * Stop is a class that encapsulates stop.
 * Construct with a Yelp Fusion API object with 1 argument, or using lat and long with 2 arguments 
 */
export class Stop {
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
 * Notice that the order could be mutated, so a route that
 * goes to F or G or H first, then E, then A or B, then C or D
 * is also a valid route.
 * 
 * A suggestion is an Array of Array that look like this:
 * [
 * [E,A,F,C],
 * [A,D,E,F],
 * [D,E,F,A],
 * ...
 * ]
 * the top one is the most recommended one.
 * 
 * Different subclasses have different algorithms
 * for suggesting possible routes.
 * 
 * Using ES6 class sugar syntax.
 */
export class OrAndRouteSuggester {
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
     * Abstract method that calculates worst case runtime complexity of the
     * subclass strategy. Complexity is simply Big O of number of candidate routes in the search space. 
     * (complexity of calculating length of candidate route, sorting etc is ignored)
     * Different subclasses will have different runtime hence return different
     * Number for this method.
     * 
     * This method helps app to determine which concrete Strategy (subclass) to use.
     *
     * @param {Array.Array.Stop} or_and_stop_arr the list of all candidate stops grouped by category
     *
     * @returns {Number} - Complexity is simply Big O of number of candidate routes in the search space. 
     */
    calculate_worst_case_complexity(or_and_stop_arr) {
      throw "OrAndRouteSuggester.calculate_worst_case_complexity() is an abstract method. Call OrAndRouteSuggester's concrete subclass' calculate_worst_case_complexity() instead.";
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

/**
 * LatLongOrAndRouteSuggester is an implementation of the abstract
 * strategy OrAndRouteSuggester.
 */
export class LatLongOrAndRouteSuggester extends OrAndRouteSuggester {
    /**
     * Public method suggest() calculates Euclidean distance among an array of
     * latitude and longitude coordinates. This method utilizes a crude brute
     * force approach by iterating through ALL possible routes, and returns
     * `max_num` number of routes to suggest.
     *
     * @param {Stop} start_stop user pre-selected start of route 
     * @param {Array.Array.Stop} or_and_stop_arr the list of all candidate stops grouped by category 
     * @param {Stop} end_stop user pre-selected destination 
     * @param {Number} max_num the number of route candidates to be returned
     * 
     * @returns {Array.Array.Stop} - each Array.Stop in this var is a SUGGESTED route
     */
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

        indices.sort(function (a, b) { return all_possible_dis[a] < all_possible_dis[b] ? -1 : all_possible_dis[a] > all_possible_dis[b] ? 1 : 0; })

        var suggested_routes_sorted_by_dis = new Array(Math.min(all_possible_routes.length, max_num));
        for (var i = 0; i < indices.length && i < max_num; i++) {
            suggested_routes_sorted_by_dis[i] = all_possible_routes[indices[i]];
        }

        return suggested_routes_sorted_by_dis;
    }

    /**
     * Calculates worst case runtime complexity of the
     * brute force strategy. This method helps app to determine whether to
     * switch to less time consuming Strategy or not.
     * 
     * Run-time analysis:
     * Assume there are `m` Or-lists.
     * Each or-list has `ni` length, where 1 <= 1 <= m.
     * Let `n_max` be `ni` with largest value.
     * 
     * Then, (run time is analyzed in terms of number of routes)
     * Worst case run time of brute force: O(m! * (n1*n2*...*nm)), exponential runtime
     *
     * @param {Array.Array.Stop} or_and_stop_arr the list of all candidate stops grouped by category
     *
     * @returns {Number} - Complexity is simply Big O of number of candidate routes in the search space. 
     */
    calculate_worst_case_complexity(or_and_stop_arr) {
      var result = 1;
      var m = or_and_stop_arr.length;

      // m!
      for (var i = 1; i <= m; i++) {
          result = result * i; 
      }

      // n1*n2*...*nm
      for (var i = 0; i < or_and_stop_arr.length; i++) {
          result = result * or_and_stop_arr[i].length;
      }

      return result;
  }

    /**
     * Private method Iterating through an array of Stop object and return the sum of distances
     * @param {Array.Stop} route a given route constructed through an array of Stops
     * @returns {Number} Euclidean distance of the route 
     */
    _calculate_length_of_route(route) {
        var total_len = 0;
        for (var i = 0; i < route.length - 1; i++) {
            total_len += route[i].lat_long_distance(route[i + 1])
        }
        return total_len
    }
}

export class GreedyLatLongOrAndRouteSuggester extends LatLongOrAndRouteSuggester {
  /**
   * Public method suggest() calculates Euclidean distance among an array of
   * latitude and longitude coordinates. Different from 
   * `LatLongOrAndRouteSuggester` that uses brute force search in all the search space,
   * this class, `GreedyLatLongOrAndRouteSuggester`, uses a greedy approach.
   * 
   * `max_num` is ignored and only one candidate is returned for now as I think it's sufficient.
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
   *     [A-B1-D] with distance 3.24
   *     [A-B2-D] with distance 2.83 <-- shortest!
   *     [A-C1-D] with distance 4
   *     [A-C2-D] with distance 3.24
   * 2. Choose the best one (Greedy!) for now: 
   * 3. Repeat step 1 to add as second detour stop: [A-B2-D]
   *     [A-B2-C1-D] with distance 4.83
   *     [A-B2-C2-D] with distance 3.41 <-- shortest!
   * 4. So this algorithm will think [A-B2-C2-D] is the shortest one.
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
      var m = or_and_stop_arr.length;

      var or_list_visited = new Array(m);
      for (var i = 0; i < or_list_visited.length; i++) { 
          or_list_visited[i] = false; 
      }
      
      var num_visited_or_list = 0;
      var last_shortest_route = [start_stop, end_stop];
      while (num_visited_or_list < m) {
          var cur_or_list_added = null;
          var cur_shortest_dis = 99999999;
          var cur_shortest_route = null;

          for (var i = 0; i < m; i++) {
              if (or_list_visited[i]) {
                  continue;
              }

              for (var j = 0; j < or_and_stop_arr[i].length; j++) {
                  var cur_route = last_shortest_route.slice(0);
                  cur_route.splice(cur_route.length-1,0,or_and_stop_arr[i][j]); // insert at second last position
                  var cur_dis = super._calculate_length_of_route(cur_route);
                  if (cur_dis < cur_shortest_dis) {
                      cur_shortest_dis = cur_dis;
                      cur_shortest_route = cur_route;
                      cur_or_list_added = i;
                  }
              }
          }

          last_shortest_route = cur_shortest_route;
          or_list_visited[cur_or_list_added] = true;
          num_visited_or_list++;
          console.log("-----------------------------------------")
      }

      return [last_shortest_route];
  }

  /**
   * Calculates worst case runtime complexity of the
   * greedy approach. This method can help app to determine whether to
   * switch strategy or not.
   * 
   * Run-time analysis:
   * Assume there are `m` Or-lists.
   * Each or-list has `ni` length, where 1 <= 1 <= m.
   * Let `n_max` be `ni` with largest value.
   * 
   * Then, (run time is analyzed in terms of number of routes)
   * Worst case time of greedy search: O(m^2 * `n_max`), polynomial run time
   *
   * @param {Array.Array.Stop} or_and_stop_arr the list of all candidate stops grouped by category
   *
   * @returns {Number} - Complexity is simply Big O of number of candidate routes in the search space. 
   */
  calculate_worst_case_complexity(or_and_stop_arr) {
      var result = 1;
      var m = or_and_stop_arr.length;

      // m^2
      result = result * m * m;

      // n_max
      var n_max = -1;
      for (var i = 0; i < or_and_stop_arr.length; i++) {
          if (or_and_stop_arr[i].length > n_max) {
              n_max = or_and_stop_arr[i].length;
          }
      }
      result = result * n_max;

      return result;
  }


}


/**
 * StopStorage is class that facilitates the UI to retrieve current information about the postential
 * stops and the current optimal route. It implements a façade design pattern that achieves both
 * information hiding and data storage of route and stop information
 */
export class StopStorage {
         constructor() {
           this._stops = []; // {Array.Array.Stop} potential candidates of waypoint
           this._start = null; // {Stop} User's route start point
           this._destination = null; // {Stop} User's destination
           this._routes = []; // {Array.Array.Stop} Suggested Routes
           this.suggester; 
           this.greedySuggester = new GreedyLatLongOrAndRouteSuggester();
           this.latLongOrAndRouteSuggester = new LatLongOrAndRouteSuggester();
         }
         /**
          * Public setter of user's start location
          *
          * @param {String} lat JSON String of Yelp Fusion API, or the current latitude of user's location
          * @param {Number} long current latitude of user's location
          */
         setStart(lat, long) {
           if (long === undefined) {
             this._start = new Stop(lat);
           } else {
             this._start = new Stop(lat, long);
           }
         }
         /**
          * Using an Yelp API Return JSON as destination.
          *
          * @param {string} json Yelp API json
          */
         setDestination(json) {
           this._destination = new Stop(json);
         }
         /**
          * Add a specific stop using a single Yelp Fusion API json string, or
          * an array of candidate Yelp Fusion API string as stops
          *
          * @param {String} listOfJson String or Array of string which user selected as desired stops
          */
         addStop(listOfJson) {
           if (listOfJson.constructor === Array) {
             var list = [];
             listOfJson.forEach(function(j) {
               list.push(new Stop(j));
             });
             this._stops.push(list);
           } else {
             this._stops.push([new Stop(listOfJson)]);
           }
         }
         /**
          * Returns current coordinate for the start position
          * @returns {Stop} contains latitude and longitude field
          */
         getStart() {
           if (this._start === undefined) return null;
           else return this._start;
         }

         /**
          * Returns current coordinate for the destination position
          * @returns {Stop} contains latitude and longitude and destination Yelp json by calling getter functions 
          */
         getDestination() {
           if (this._destination === undefined) return null;
           else return this._destination;
         }
         /**
          * Returns current coordinate for the destination position
          * @returns {Stop} contains latitude and longitude and destination Yelp json by calling getter functions 
          */
         getAllStops(){
             return this._stops;
         }
         /**
          * Deletes a stop based on GPS coordinate provided
          * @returns {boolean} True if deleted, false if None found 
          */
         deleteStopByCoordinate(lat, long){
            if (this.start !== undefined && this._start.getLatitude() == lat && this._start.getLongitude() == long) {
                this._start = null;
            }
            else if (this._destination !== undefined && this._start.getLatitude == lat && this._destination.getLongitude == long) {
                this._destination = null;
            }
            else {
                for (var i = 0; i < this._stops.length; i++) {
                    for (var j = 0; j < this._stops[i].length; j++) {
                        if (this._stops[i][j].getLatitude() == lat && this._stops[i][j].getLongitude() == long) {
                            this._stops[i].splice(j, j+1);
                            return true;
                        }
                    }
                }
            }
            return false;
         }
         /**
          * Deletes a stop based on Yelp JSON (Stop.info)
          * @returns {boolean} True if deleted, false if None found 
          */
         deleteStopByJSON(json) {
             var jobj = JSON.parse(json);
             var lat = jobj.coordinates.latitude;
             var long = jobj.coordinates.longitude;

             if (this.start !== undefined && this._start.getLatitude() == lat && this._start.getLongitude() == long) {
                 this._start = null;
             }
             else if (this._destination !== undefined && this._start.getLatitude == lat && this._destination.getLongitude == long) {
                 this._destination = null;
             }
             else {
                 for (var i = 0; i < this._stops.length; i++) {
                     for (var j = 0; j < this._stops[i].length; j++) {
                         if (this._stops[i][j].getLatitude() == lat && this._stops[i][j].getLongitude() == long) {
                             this._stops[i].splice(j, j + 1);
                             return true;
                         }
                     }
                 }
             }
             return false;
         }
         /**
          * Public async method that retrieves the current optimal stops along with the necessary json to construct a map view
          *
          * @param {function} fn function that takes one argument as the result of the suggestion.
          *                      It would contain 10 route suggestions in the format of Array
          *                      of {viewport: {northeast: {lat, long}, southwest: {lat, long}},
          *                          coordinates: array,
          *                          polyline: string,
          *                          time: string}
          */
         getSuggestion(callback) {
           if (this._start == null) throw "The UI has not called setStart() with current location or user address location";
           if (this._destination == null) throw "The UI has not called setDestination() with a valid yelp json string";
           this._routes = [];
           //mode = "driving";
           var mode = "walking";
           // mode = "bicycling";
           // mode = "transit";
           var results = [];
           
           if (this.latLongOrAndRouteSuggester.calculate_worst_case_complexity(this._stops) > 30000) {
             this.suggester = this.GreedyLatLongOrAndRouteSuggester;
           }
           else {
            this.suggester = this.latLongOrAndRouteSuggester;
           }
           
           var routes = this.suggester.suggest(this._start, this._stops, this._destination, 10);
           this._stops = routes.slice(1, routes.length - 1);
           var routesLeft = routes.length;
           routes.forEach(function(route) {
             var waypoints = "";
             const Http = new XMLHttpRequest();
             for (var i = 1; i < route.length - 1; i++) {
               waypoints += "via:" + String(route[i].latitude) + "," + String(route[i].longitude) + "|";
             }
             waypoints = waypoints.substring(0, waypoints.length - 1);
             var url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + route[0].latitude + "," + route[0].longitude + "&destination=" + route[route.length - 1].latitude + "," + route[route.length - 1].longitude + "&mode=" + mode + "&waypoints=" + waypoints + "&key=AIzaSyDH6H2IlW_LHCmfh0CV0-aS9aR19XMsn94";
             Http.open("GET", url);
             // console.log(url);
             Http.send();
             Http.onreadystatechange = e => {
               if (Http.readyState == 4 && Http.status == 200) {
                 let response = JSON.parse(Http.responseText);
                 var routeDetail = {
                   viewport: response.routes[0].bounds, coordinates: route, polyline: response.routes[0].overview_polyline.points, time: {
                     text: response.routes[0].legs[0].duration.text, value: response.routes[0].legs[0].duration.value}};
                 results.push(routeDetail);
                 routesLeft--;
                 if (routesLeft === 0) {
                   results.sort(function(routeA, routeB) {
                      var keyA = routeA.time.value;
                      var keyB = routeB.time.value;
                      if (keyA < keyB) return -1;
                      if (keyB < keyA) return 1;
                      return 0;
                   })
                   callback(results);
                 }
               }
             };
           });
         }
       }
