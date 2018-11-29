'use strict'

import React, { Component } from 'react';
import  AddStopPage  from './AddStopPage'
//import { StopStorage } from './StopStorage'
//import { RouteBoxer } from './RouteBoxer'

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
		try {
			var addStop = new AddStopPage(this.props);
			var locations = [];
			//var lats = 37.4220;
			//var longs = -122.0840;
			for (let i = 0; i < stops.length; i = i++)	{
				//console.log(i)
				if (stops[i] != null)	{
					//console.log("wtf" + stops[i].latitude)
					addStop.yelp_search(stopType, stops[i].latitude, stops[i].longitude);
					//while (addStop.state.isLoading == true)	{
						//addStop.yelp_search("in n out", stops[i].latitude, stops[i].longitude)	
					//}
					//yelp.setState({ isLoading: true});
					locations.push(addStop.state.results);
				}
			}
			console.log(locations)
			return locations;
		} catch (error)	{
		  alert(error)
		  return error;	
		}
	}


	
/* // needs RouteBoxer to run
var directionService = new google.maps.DirectionsService();
var rboxer = new RouteBoxer();
var distance = 15*1.6; // in miles 
var stopArray = [];
var yelp = new AddStopPage();
var type = "gas";

	directionService.route(request, function(result, status) {
	  if (status == google.maps.DirectionsStatus.OK) {

		var path = result.routes[0].overview_path;
		var boxes = routeBoxer.box(path, distance);

		for (var i = 0; i < boxes.length; i++) {
		  var bounds = box[i];
		  var stop = bounds.getCenter();
		  yelp.yelp_search(type, stop.lat(), stop.long());
		  stopArray.push(yelp.state.results);
		}
	  }
	});
	
console.log(stopArray);
 */

	
	

}
