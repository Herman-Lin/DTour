const { StopRecommender } = require('../StopRecommender');
XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

test("Test StopRecommender API - Route Independent Yelp Search Requirement", done => {
  jest.setTimeout(1000);
  var sr = new StopRecommender();
  function normalYelpSearchCallback(result) {
    // Scenario 1: No Route Generated - Route Independent Yelp Search Requirement
    expect(JSON.stringify(result).includes("Jungle")).toEqual(true)
    done();
  }
  sr.getStopSuggestion(
    "Anime",
    { latitude: 34.052844, longitude: -118.250294 },
    true,
    normalYelpSearchCallback
  );
});

test("Test StopRecommender API - Route Independent Yelp Search Requirement", done => {
  jest.setTimeout(1000);
  var sr = new StopRecommender();
  function addressYelpSearchCallback(result) {
    // Scenario 2: No Route Generated - Route Independent Address Search Requirement
    expect(JSON.stringify(result).includes("San Clemente, CA")).toEqual(true);
    done();
  }
  sr.getStopSuggestion(
    "333 S Alameda St",
    { latitude: 34.052844, longitude: -118.250294 },
    true,
    addressYelpSearchCallback
  );
});

test("Test StopRecommender API - Route Dependent Yelp Search Requirement #1", done => {
  jest.setTimeout(1000);
  var sr = new StopRecommender();
  function routedAddressYelpSearchCallback(result) {
    // Scenario 3: Route Generated - Route Dependent Yelp Search Requirement
    expect(JSON.stringify(result).includes("Downtown Los Angeles Farmer's Market")).toEqual(true);
    done();
  }
  sr.getStopSuggestion( 
    "Supermarket",
    [{ latitude: 34.052844, longitude: -118.250294 }, { latitude: 34.049064, longitude: -118.224575 }, { latitude: 34.047104, longitude: -118.245294 }],
    false,
    routedAddressYelpSearchCallback
  );
});

test("Test StopRecommender API - Route Dependent Yelp Search Requirement #2", done => {
    jest.setTimeout(5000);
    var sr = new StopRecommender();
    function routedAddressYelpSearchCallback(result) {
        // Scenario 4: Route Generated - Route Dependent Yelp Search Requirement but does not return result outside of radius
        expect(JSON.stringify(result).includes("Ronald Reagan")).toEqual(false);
        done();
    }
    sr.getStopSuggestion(
        "UCLA",
      [{ latitude: 37.873883, longitude: -122.259142 }, { latitude: 37.869558, longitude: -122.300151 }, { latitude: 37.860344, longitude: -122.299255 }],
        false,
        routedAddressYelpSearchCallback
    );
});