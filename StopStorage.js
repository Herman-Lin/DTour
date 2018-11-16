/**
 * Stop is a class that encapsulates stop.
 * Construct with a Yelp Fusion API object with 1 argument, or using lat and long with 2 arguments 
 */
class Stop {
    /**
     * @param {String} lat Latitude of the Stop, or Yelp Fusion API json string
     * @param {Number} long Longitude of the stop, or undefined if using Yelp Fusion API
     */
    constructor(lat, long) {
        if (long === undefined) {
            this.latitude = JSON.parse(lat).coordinates.latitude;
            this.longitude = JSON.parse(lat).coordinates.longitude;
        }
        else {
            this.latitude = lat;
            this.longitude = long;
        }
    }

    getLatitude() {return this.latitude;}
    getLongitude() {return this.longitude;}

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
 * for suggesting posible routes.
 * 
 * Using ES6 class sugar syntax.
 */
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

/**
 * LatLongOrAndRouteSuggester is an implementation of the abstract
 * strategy OrAndRouteSuggester.
 */
class LatLongOrAndRouteSuggester extends OrAndRouteSuggester {
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

/**
 * StopStorage is class that facilitates the UI to retrieve current information about the postential
 * stops and the current optimal route. It implements a façade design pattern that achieves both
 * information hiding and data storage of route and stop information
 */
export class StopStorage {
    constructor() {
        this._stops = []; // {Array.Array.Stop} potential candidates of waypoint
        this._start = null; // {Stop} User's route start point 
        this._destination = null;  // {Stop} User's destination
        this.suggester = new LatLongOrAndRouteSuggester(); // Route Suggest Handler
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
            listOfJson.forEach(function (j) {
                list.push(new Stop(j));
            });
            this._stops.push(list);
        }
        else {
            this._stops.push([new Stop(listOfJson)]);
        }
  }
  /**
   * Public method that retrieves the current optimal stops along with the necessary json to construct a map view
   *  
   * @returns {Array.String} return 10 route suggestions in the format of Array 
   *                         of {viewport: {northeast: {lat, long}, southwest: {lat, long}},
   *                             coordinates: array, 
   *                             polyline: string, 
   *                             time: string}
   */
  getSuggestion() {
    if (this._start == null)
      throw "The UI has not called setStart() with current location or user address location";
    if (this._destination == null)
      throw "The UI has not called setDestination() with a valid yelp json string";
    //mode = "DRIVING";
    var mode = "WALKING";
    // mode = "BICYCLING";
    // mode = "TRANSIT";
    var results = [];
    this.suggester.suggest(this._start, this._stops, this._destination, 10).forEach(function (routes) {
          var waypoints = "";
          const Http = new XMLHttpRequest();
          for (var i = 1; i < routes.length - 1; i++) {
            waypoints += "via:" + String(routes[i].latitude) + "," + String(routes[i].longitude) + "|"
          }
          waypoints = waypoints.substring(0, waypoints.length - 1);
          var url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + routes[0].latitude + "," + routes[0].longitude +
          "&destination=" + routes[routes.length-1].latitude + "," + routes[routes.length-1].longitude + "&mode=" + mode + "&waypoints=" + waypoints + "&key=AIzaSyDH6H2IlW_LHCmfh0CV0-aS9aR19XMsn94";
          console.log(url);
          Http.open("GET", url);
          Http.send();
          Http.onreadystatechange = e => {
            if (Http.readyState == 4 && Http.status == 200) {
                let response = JSON.parse(Http.responseText);
                var routeDetail = {"viewport": response.routes[0].bounds,
                                   "coordinates": routes,
                                   "polyline": response.routes[0].overview_polyline.points,
                                   "time": response.routes[0].legs[0].duration.text}
                results.push(routeDetail);
            }
        }
    });
    return results;
  }
}