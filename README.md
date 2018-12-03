# Directory structure of the project

DTour - react-native base folder - run command react-native run-android / run-ios here
```
 |_ .git - git init generated folder
 |_ android - react-native generated Android-compatible app code
    |_ - react-native generated Android Studio Project Directories
 |_ components - contains component source code for front-end modules
 |_ ios - react-native generated iOS-compatible XCode project
    |_ - react native generated iOS XCode Project Directories
 |_ node_modules - required libraries, generated after running yarn install
 |_ out - contains Documentation and Project report related files
    |_ .. - Contains assets required to run the React web app that supports the usage of web JSDoc
 |_ test - contains all tests specified below, which can be run with yarn jest when inside the base folder
```

# Documentation
Html pages are auto generated when running
```
jsdoc [filename with class to document]
```
Auto generated HTML is available in the out folder
Also viewable as PDF in the out folder

# Testing scnearios
Please see `test` folder for jest unit testing.

To execute the testing scenarios, just run `yarn test`.

For more instruction, check [here](https://jestjs.io/docs/en/getting-started.html).


## Testing scenario 1. Stop class
Test whether lat_long_distance() returns correct Euclidean distance based on lat and long.

```
input: (0,0), (1,0) --> expected output: 1
input: (1,0), (0,0) --> expected output: 1
input: (2,2), (1,0) --> expected output: sqrt(5)
```

## Testing scenario 2. OrAndRouteSuggester
Test whether _get_all_possible_routes() return all possible routes or not

```
input: (0,0), { [(1,0), (1,1)] }, (2,2)  --> expected output: (0,0),(1,0),(2,2); (0,0),(1,1),(2,2)
input: (0,0), { [(2,0)] }, (2,2) --> expected output: (0,0),(2,0),(2,2)
input: (0,0), { [(1,0), (1,1)], [(2,0)] }, (2,2) --> expected output: (0,0),(1,0),(2,0),(2,2); 
                                                                      (0,0),(1,1),(2,0),(2,2); 
                                                                      (0,0),(2,0),(1,0),(2,2); 
                                                                      (0,0),(2,0),(1,1),(2,2)
```

## Testing scenario 3. LatLongOrAndRouteSuggester
Test whether suggest() of LatLongOrAndRouteSuggester suggests routes sorted by shortest distances (calculated by latitude and longitude on.ly)

```
input: (0,0), { [(1,0), (1,1)], [(2,0)] }, (2,2) --> expected output: (0,0),(1,0),(2,0),(2,2); // closest to go to 4 places
                                                                      (0,0),(1,1),(2,0),(2,2); 
                                                                      (0,0),(2,0),(1,1),(2,2); 
                                                                      (0,0),(2,0),(1,0),(2,2)  // farthest to go to 4 places
```
## Testing scenario 4. StopStorage
Test whether suggest() of LatLongOrAndRouteSuggester suggests routes sorted by shortest distances (calculated by latitude and longitude on.ly)

```
input: calls setStart with coordinate. --> expected output: private start coordinate updated
input: calls setDestination with JSON. --> expected output: private end coordinate updated
input: calls addStop with coordinate. --> expected output: private stop coordinate added
input: calls addStop with JSON. --> expected output: private stop coordinate added
```

## Testing scenario 5. AddDeleteStopButton
Test whether the buttons will call the correct functions, checks if it is in the correct state after button is pressed for frontend
Ensures that even if the code is changed that the functions must be called, even when code changes the state of buttons should change based on being pressed

```
input: onPress() for Add button, onPress() for Delete button --> expected output: function on Add called once, function on Delete called once
input: onPress() for Add button --> expected output: function has addDisabled false and deleteDisabled true before press,
                                                     function has addDisabled true and deleteDisabled false after press

```
## Testing scenario 6. LocationList
Test whether the results will appear correctly for the search
There is now no difference between address and yelp
Checks that for start/stop/destination the search will show results if results are given
If an invalid flag for which is being searched is called, no results shown

```
input: search on start (-1), one Yelp result in results --> expected output: has 1 LocationSuggestion element
input: search on stop (0), one Yelp result in results --> expected output: has 1 LocationSuggestion element
input: search on destination (-2), one Yelp result in results --> expected output: has 1 LocationSuggestion element
input: search invalid (-3), one Yelp result in results --> expected output: has 0 LocationSuggestion elements

```

## Testing scenario 7. GreedyLatLongOrAndRouteSuggester
Test whether suggest() and calculate_worst_case_complexity() of GreedyLatLongOrAndRouteSuggester suggests routes sorted by greedy approach and return correct Big O complexity.

```
suggest()
input: (0,0), { [(1,0), (1,1)], [(2,0)] }, (2,2) --> expected output: (0,0),(1,1),(2,1),(2,2)
input: (0,0), {
                [(1,0), (1,4), (3,4)],
                [(2,1), (2,3), (0,3)],
                [(1,7)],
                [(2,6),(1,5),(3,1),(1,1)]
              }, (3,7) --> expected output: (0,0),(1,4),(2,6),(1,7),(2,1),(3,7)

calculate_worst_case_complexity() 
input: (0,0), { [] }, (2,2) --> expected output: 0
input: (0,0), {
                [(1,0), (1,4), (3,4)],
                [(2,1), (2,3), (0,3)],
                [(1,7)],
                [(2,6),(1,5),(3,1),(1,1)]
              }, (3,7) --> expected output: 64
```

## Testing scenario 8. StopRecommender
Test the behavior of stop suggestion module under multiple scenarios. 

```
getStopSuggestion()
input : (
    "Anime",
    { latitude: 34.052844, longitude: -118.250294 },
    true,
    normalYelpSearchCallback) --> expected output: search result is JSONifyable AND contains the search result "Anime Jungle"
input : (
    "333 S Alameda St",
    { latitude: 34.052844, longitude: -118.250294 },
    true,
    addressYelpSearchCallback) --> expected output: result came from Google Maps Autocomplete AND contains the result found in San Clemente, CA.
input : (
 "Supermarket",
    [{ latitude: 34.052844, longitude: -118.250294 }, { latitude: 34.049064, longitude: -118.224575 }, { latitude: 34.047104, longitude: -118.245294 }],
    false,
    routedAddressYelpSearchCallback) --> expected output: result will contain Downtown Los Angeles Farmer's Market, which is not within the maximum Yelp radius if searched only by starting, waypoint, and destinations' coordinates but instead covered throughout the route
   
input : (
        "UCLA",
      [{ latitude: 37.873883, longitude: -122.259142 }, { latitude: 37.869558, longitude: -122.300151 }, { latitude: 37.860344, longitude: -122.299255 }],
        false,
        routedAddressYelpSearchCallback) --> expected output: result will not contain anything that is outside the reasonable walking radius
```
