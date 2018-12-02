class YelpSearchParameter {
    constructor(searchStr, latitude, longitude, radius) {
        this.term = searchStr;
        this.latitude = latitude;
        this.longitude = longitude;
        this.radius = radius;
    };
}

export class StopRecommender {
         constructor() {
           this.radius = 1260; // 15 minutes walking distance (1.4 m/s * 900s)
           this.delta = 420; // setting one-third of radius to overlappable
           this.searchesRemaining = 0;
           this.earthRadius = 6378100;
         }

         /**
          * Given an user input string and location input, pass the result in the given callback function
          * If user entered an address, the function will use Google Maps Autocomplete instead.
          *
          * @ param {String} searchStr User input, can be address or a search term
          * @ param {Array} stops an array of JSON coordinates representing a route, or an object with latitude and longitude attribute to perform normal yelp search
          *                 if the array consists of only one coordinate, then normal yelp search will be performed
          * @ param {boolean} nonStop true if start or destination
          * @ param {function} callback a callback function that handles the suggestion results
          */

         getStopSuggestion(searchStr, stops, nonStop, callback) {
           if (searchStr == undefined) {
             return;
           }
           if (searchStr.match(/^[\d]+ /i) !== null) {
             if (stops.constructor === Array) {
               var latitude = stops[0].latitude;
               var longitude = stops[0].longitude;
             } else {
               var latitude = stops.latitude;
               var longitude = stops.longitude;
             }
             const Http = new XMLHttpRequest();
             var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + encodeURIComponent(searchStr) + "&key=AIzaSyAwnXWH-qrRpBWraATnVVyHxKYuRSZEQ8M&location=" + String(latitude) + "," + String(longitude);
             Http.open("GET", url);
             Http.send();
             Http.onreadystatechange = e => {
               if (Http.readyState == 4 && Http.status == 200) {
                 let response = JSON.parse(Http.responseText);
                 var suggestions = [];
                 var predictionCount = response["predictions"].length;
                 response["predictions"].forEach(function(prediction) {
                   const Http2 = new XMLHttpRequest();
                   var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + encodeURIComponent(prediction["place_id"]) + "&key=AIzaSyAwnXWH-qrRpBWraATnVVyHxKYuRSZEQ8M";
                   Http2.open("GET", url);
                   Http2.send();
                   Http2.onreadystatechange = e => {
                     if (Http2.readyState == 4 && Http2.status == 200) {
                       var response2 = JSON.parse(Http2.responseText);
                       var result_json = { name: prediction["description"], image_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ic_pin_drop_48px.svg/500px-Ic_pin_drop_48px.svg.png", is_closed: false, review_count: 0, categories: [{ alias: "Address", title: "Address" }], rating: "No Reviews", coordinates: { latitude: response2.result.geometry.location.lat, longitude: response2.result.geometry.location.lng }, price: "$", location: { display_address: [prediction["description"]] } };
                       suggestions.push(result_json);
                       predictionCount--;
                       if (predictionCount == 0) {
                         callback(suggestions);
                       }
                     }
                   };
                 });
               }
             };
           } else if (stops.constructor === Array && stops.length > 1) {
             var searchQueue = [];
             for (var i = 1; i < stops.length; i++) {
               var stop1 = JSON.parse(stops[i - 1]);
               var stop2 = JSON.parse(stops[i]);
               // Haversine Formula
               var phi1 = (parseFloat(stop1.latitude) * Math.PI) / 180;
               var phi2 = (parseFloat(stop2.latitude) * Math.PI) / 180;
               var dphi = (parseFloat(stop2.latitude - stop1.latitude) * Math.PI) / 180;
               var dlambda = ((parseFloat(stop2.longitude) - parseFloat(stop1.longitude)) * Math.PI) / 180;
               var a = Math.sin(dphi / 2) * Math.sin(dphi / 2) + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlambda / 2) * Math.sin(dlambda / 2);
               var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
               var d = this.earthRadius * c; // Distance between two geocoord

               // Adding queries that are within 15 minute walking distances along the route
               var searchSpacing = 2 * this.radius - this.delta;
               var numSearches = Math.floor(d / searchSpacing);
               var dx = parseFloat(stop2.latitude - stop1.latitude) / numSearches;
               var dy = parseFloat(stop2.longitude - stop1.longitude) / numSearches;
               for (var j = 0; j < numSearches; j++) {
                 searchQueue.push(new YelpSearchParameter(searchStr, stop1.latitude + dx * j, stop1.longitude + dy * j, this.radius));
               }
               searchQueue.push(new YelpSearchParameter(searchStr, stop2.latitude, stop2.longitude, this.radius));
             }
             var searchLeft = searchQueue.length;
             var suggestionSet = new Set();
             searchQueue.forEach(function(yelpSearchParam) {
               const Http = new XMLHttpRequest();
               var url = "https://api.yelp.com/v3/businesses/search?" + "term=" + encodeURIComponent(yelpSearchParam.term) + "&latitude=" + String(yelpSearchParam.latitude) + "&longitude=" + String(yelpSearchParam.longitude) + "&sort_by=best_match";
               if (!nonStop) {
                   url += "&radius=" + String(yelpSearchParam.radius);
               }
               else {
                   url += "&radius=" + String(40000);
               }
               Http.open("GET", url);
               Http.setRequestHeader("Authorization", "Bearer " + "nMpM6dLuTMoyzu4q1dCBJPsSSSjqZ9UP7pTrRLbR5PSNni3wcHhZWKbAHRxYRhoosUdTkvmP5-D4HtAUbNLNXyensvOMaUw5nS_raYiV1raMvDNO5_t0-hF7GJH_W3Yx");
               Http.send();
               Http.onreadystatechange = e => {
                 if (Http.readyState == 4 && Http.status == 200) {
                   let response = JSON.parse(Http.responseText);
                   response["businesses"].forEach(function(business) {
                     var result_json = { name: business["name"], image_url: business["image_url"], is_closed: business["is_closed"], review_count: business["review_count"], categories: business["categories"], rating: business["rating"], coordinates: business["coordinates"], price: business["price"], location: business["location"] };
                     suggestionSet.add(result_json);
                   });
                   searchLeft--;
                   if (searchLeft == 0) {
                     callback(Array.from(suggestionSet));
                   }
                 }
               };
             });
           } else {
             if (stops.constructor === Array) {
                console.log(stops[0]);
               var latitude = stops[0].latitude;
               var longitude = stops[0].longitude;
             } else {
               var latitude = stops.latitude;
               var longitude = stops.longitude;
             }
             result = [];
             const Http = new XMLHttpRequest();
             var url = "https://api.yelp.com/v3/businesses/search?" + "term=" + encodeURIComponent(searchStr) + "&latitude=" + String(latitude) + "&longitude=" + String(longitude) + "&radius=" + String(this.radius);
             Http.open("GET", url);
             Http.setRequestHeader("Authorization", "Bearer " + "nMpM6dLuTMoyzu4q1dCBJPsSSSjqZ9UP7pTrRLbR5PSNni3wcHhZWKbAHRxYRhoosUdTkvmP5-D4HtAUbNLNXyensvOMaUw5nS_raYiV1raMvDNO5_t0-hF7GJH_W3Yx");
             Http.send();
             Http.onreadystatechange = e => {
               if (Http.readyState == 4 && Http.status == 200) {
                 let response = JSON.parse(Http.responseText);
                 response["businesses"].forEach(function(business) {
                   var result_json = { name: business["name"], image_url: business["image_url"], is_closed: business["is_closed"], review_count: business["review_count"], categories: business["categories"], rating: business["rating"], coordinates: business["coordinates"], price: business["price"], location: business["location"] };
                   result.push(result_json);
                 });
                 callback(result);
               }
             };
           }
         }
       };