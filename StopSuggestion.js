'use strict'

import React from 'react';
import AddStopPage from './AddStopPage'
import { StopStorage } from './StopStorage'


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
}
