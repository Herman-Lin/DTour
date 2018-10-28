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

export default class App extends Component{
  constructor(props) {
    super(props);
    this.state = {textValue: 'JSON Response will be shown'};
  }
   places_search = (search_str, latitude, longitude) => {
     const Http = new XMLHttpRequest();
     url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + String(latitude) + "," + String(longitude) + "&radius=40000" + "&keyword=" + encodeURIComponent(search_str) + "&key=AIzaSyAwnXWH-qrRpBWraATnVVyHxKYuRSZEQ8M";
     Http.open("GET", url);
     Http.send();
     Http.onreadystatechange = e => {
       if (Http.readyState == 4 && Http.status == 200) {
         let response = JSON.parse(Http.responseText);
         var result = [];
         for (var i = 0; i < response["results"].length; i++) {
           result_json = { name: response["results"][i]["name"], ratings: response["results"][i]["ratings"], types: response["results"][i]["types"], location: response["results"][i]["geometry"]["location"] };
           result.push(result_json);
         }
         console.debug(result);
         this.setState({
           textValue: JSON.stringify(result)
         });
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
         result = {
           "time": response['routes'][0]['legs'][0]['duration']['value'],
           "distance": response['routes'][0]['legs'][0]['distance']['value'],
           "polyline": response['routes'][0]['overview_polyline']['points']
         };
         console.log(result);
         this.setState({
           textValue: JSON.stringify(result)
         });
       }
     };
   };

  yelp_search = (search_str, latitude, longitude) => {
    const Http = new XMLHttpRequest();
    url = "https://api.yelp.com/v3/businesses/search?" + "term=" + encodeURIComponent(search_str) + "&latitude=" + String(latitude) + "&longitude=" + String(longitude);
    Http.open("GET", url);
    Http.setRequestHeader('Authorization', 'Bearer ' + 'ngBHhApCaTwA0HfEvloYx0N57iWuE3TW1OkKRZ74PKbfDyZBThUWZHemHJ3LeltzP6NQ1dP3leLIepkqVxIkUX7R5xjNBo4vznjOZuOZVFMbgCWWEyxrZHuNNujUW3Yx');
    Http.send();
    Http.onreadystatechange = (e) => {
      if (Http.readyState == 4 && Http.status == 200) {
        response = JSON.parse(Http.responseText)

        var result = []
        for (var i = 0; i < response['businesses'].length; i++) {
          result_json = {
            "name": response['businesses'][i]['name'],
            "image_url": response['businesses'][i]['image_url'],
            "is_closed": response['businesses'][i]['is_closed'],
            "review_count": response['businesses'][i]['review_count'],
            "categories": response['businesses'][i]['categories'],
            "rating": response['businesses'][i]['rating'],
            "coordinates": response['businesses'][i]['coordinates'],
            "price": response['businesses'][i]['price'],
            "location": response['businesses'][i]['location'],
          }
          result.push(result_json)
        }
        console.log(result);
        this.setState({
          textValue: JSON.stringify(result)
        });
      }
    }
  }

   // Front End: Replace parameter to do different queries
   render() {
     return [<Button title="Query Place" onPress={() => this.places_search("Anime", 34.069819, -118.45316)} />, <Button title="Query Route" onPress={() => this.route_search(1, 34.069819, -118.453163, 34.039046, -118.442303)} />, <Button title="Query Yelp" onPress={() => this.yelp_search("ramen", +34.06893, -118.445127)} />, <View>
         <Text style={{ color: "red" }}>{this.state.textValue}</Text>
       </View>];
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
