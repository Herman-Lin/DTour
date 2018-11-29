'use strict'

import React, { Component } from 'react';

export class StopSuggestion	{
	
  /**
   * Using Google Direction API to find route data
   * @param {string} orig origin of route
   * @param {string} dest destination of route
   * @param {string} type type of stop user wants to visit
   */
	route_search = (orig, dest, type) => {
		const Http = new XMLHttpRequest();
		var MapKey = "AIzaSyDH6H2IlW_LHCmfh0CV0-aS9aR19XMsn94";
		var url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + encodeURIComponent(orig) + "&destination=" +encodeURIComponent(dest) + "&key=" + MapKey;
		var stops;
		console.log(url);
		Http.open("GET", url);
		Http.send();
		Http.onreadystatechange = e => {
			if (Http.readyState == 4 && Http.status == 200) {
			  let response = JSON.parse(Http.responseText);
			  var start = response.routes.bounds.southwest;
			  var end = response.routes.bounds.northeast;
			  stops = basic_stop_search(start.lat, start.lng, end.lat, end.lng, type);
			}
		};
		return stops;
	};
	
  /**
   * Finding stops along route 
   * @param {float} origLat origin's Latitude of route
   * @param {float} origLong origin's Longitude of route
   * @param {float} destLat destination's Latitude of route
   * @param {float} destLong destinations's Longitude of route
   * @param {string} type type of stop user wants to visit
   */
	basic_stop_search = (origLat, origLong, destLat, destLong, type) => {
		var SP = SearchPage();
		var latDiff = destLat - origLat;
		var longDiff = destLong - origLong;
		var locations = [];
		var interval = 5
		var yelp = new AddStopPage();
		let j = longDiff/interval;
		for (let i = latDiff/interval; i != latDiff; i = i+(latDiff/interval))	{
			yelp.yelp_search(type, origLat+i, origLong+j);
			locations.push(yelp.state.results);
			j = (j+longDiff/interval);
		}
		return locations;
	}
	
	/**
   * For each stop, generate potential places that can be visited
   * @param {array} Array of coords of stops
   * @param {string} type type of stop user wants to visit
   */
	generate_stops = (stops, stopType) => {
		// set to remove dupes
		var locationSet = new Set();
		var key = "AIzaSyAGujL9LLERhk4Y0N4R4Cbeqww14FDPR60";
		var radius = 180;
		var overlap = 110;
		// how far each search substop will be spaced apart
		var factor = 2 * radius - overlap; 
        const Http = new XMLHttpRequest();
		// for all stops, find substops and do yelp search for all of them
		for (let i = 1; i < stops.length; i++)	{
			// find the distance between each pair of stops, and calculate how many times to search on this section
			let mapURL = "https://maps.googleapis.com/maps/api/distancematrix/json?origins="+ String(stops[i-1].latitude) + "," + String(stops[i-1].longitude) + "&destinations=" + String(stops[i].latitude) + "," + String(stops[i].longitude) +"&key=AIzaSyAGujL9LLERhk4Y0N4R4Cbeqww14FDPR60";
			Http.open("GET", url);
			Http.send();
			Http.onreadystatechange = e => {
				if (Http.readyState == 4 && Http.status == 200) {
					let response = JSON.parse(Http.responseText);
					// distance between the stops divided by the factor = how many times we will call yelp search on this section (# of substops)
					let iterations = response.rows[0].elements[0].distance.value/factor;
					// latitude difference/# of substops
					let latDiff = (stops[i].latitude - stops[i-1].latitude)/iterations;
					// longitude difference/# of substops
					let longDiff = (stops[i].longitude - stops[i-1].longitude)/iterations;				  
					for (let j = 1; j < iterations; j++)	{
						// for each substop, make a yelp request
						let searchResult = yelp_request(stopType, stops[i-1].latitude + latDiff, stops[i-1].longitude + longDiff, radius);
						locationSet.add(searchResult);
					}
				}
			};	
		}
		var locations = Array.from(locationSet);
		//console.log(locations)
		return locations[];
	}
	
	//
	yelp_request = (stopType, latitude, longitude, radius) => {
      const Http = new XMLHttpRequest();
	  var result = [];
      var yelpURL = "https://api.yelp.com/v3/businesses/search?" + "term=" + encodeURIComponent(stopType) + "&latitude=" + String(latitude) + "&longitude=" + String(longitude) + "&radius=" + String(radius) + "&sort_by=distance";
      Http.open("GET", yelpURL);
      Http.setRequestHeader('Authorization', 'Bearer ' + 'crhXlVpb7fS-f0kxhgFDr8ja2OjrWsopyviJeJQUdfON39GlVobMcQ6fuiZsApWiBRVq_SiiCw4cSvAy-5-abf09fZ42N3MpM5zvEavR3GkJ2ep3XbCd5-eMe6L_W3Yx');
      Http.send();
      Http.onreadystatechange = (e) => {
        if (Http.readyState == 4 && Http.status == 200) {
          var response = JSON.parse(Http.responseText)
          response['businesses'].forEach(function (business) {
            var result_json = {
              "name": business['name'],
              "image_url": business['image_url'],
              "is_closed": business['is_closed'],
              "review_count": business['review_count'],
              "categories": business['categories'],
              "rating": business['rating'],
              "coordinates": business['coordinates'],
              "price": business['price'],
              "location": business['location'],
            }
            result.push(result_json)
          });
        }
      }
	  return result[];
    }

	
	

}
