# Directory structure of the project

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
