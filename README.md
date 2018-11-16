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
