/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';



const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
   
   places_search = (search_str, latitude, longitude) => {
     const Http = new XMLHttpRequest();
     url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + String(latitude) + "," + String(longitude) + "&radius=40000" + "&keyword=" + encodeURIComponent(search_str) + "&key=AIzaSyAwnXWH-qrRpBWraATnVVyHxKYuRSZEQ8M";
     Http.open("GET", url);
     Http.send();
     console.log('sent');
     Http.onreadystatechange = e => {
       if (Http.readyState == 4 && Http.status == 200) {
         let response = JSON.parse(Http.responseText);
         var result = [];
         for (var i = 0; i < response["results"].length; i++) {
           result_json = { name: response["results"][i]["name"], ratings: response["results"][i]["ratings"], types: response["results"][i]["types"], location: response["results"][i]["geometry"]["location"] };
           result.push(result_json);
         }
         console.debug(result);
       }
     };
   };

   route_search = (mode, start_latitude, start_longitude, end_latitude, end_longitude) => {
     const Http = new XMLHttpRequest();
     url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + String(start_latitude) + "," + String(start_longitude) + "&destination=" + String(end_latitude) + "," + String(end_longitude) + "&key=AIzaSyDH6H2IlW_LHCmfh0CV0-aS9aR19XMsn94";
     Http.open("GET", url);
     Http.send();
     Http.onreadystatechange = e => {
       if (Http.readyState == 4 && Http.status == 200) {
         let response = JSON.parse(Http.responseText);
         json_response = {
           "time": response['routes'][0]['legs'][0]['duration']['value'],
           "distance": response['routes'][0]['legs'][0]['distance']['value'],
           "polyline": response['routes'][0]['overview_polyline']['points']
         };
         console.log(json_response);
       }
     };
   };

   render() {
     return [<Button title="Query Place" onPress={ () => this.places_search("Anime", 34.069819, -118.45316)} />,
        <Button title="Query Route" onPress={() => this.route_search(1, 34.069819, -118.453163, 34.039046, -118.442303)} />]
       ;
   }
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
