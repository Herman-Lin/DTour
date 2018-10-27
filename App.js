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
    console.log('sent')
    Http.onreadystatechange = (e) => {
      if (Http.readyState == 4 && Http.status == 200) {
        let response = JSON.parse(Http.responseText)
        var result = []
        for (var i = 0; i < response['results'].length; i++) {
          result_json = { 
              "name": response['results'][i]['name'],
              "ratings": response['results'][i]['ratings'],
              "types": response['results'][i]['types'],
              "location": response['results'][i]['geometry']['location']
            }
          result.push(result_json)
        }

        console.debug(result)
      }
    }
  }

  places_search = (search_str, latitude, longitude) => {
    const Http = new XMLHttpRequest();
    url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + String(latitude) + "," + String(longitude) + "&radius=40000" + "&keyword=" + encodeURIComponent(search_str) + "&key=AIzaSyAwnXWH-qrRpBWraATnVVyHxKYuRSZEQ8M";
    Http.open("GET", url);
    Http.send();
    console.log('sent')
    Http.onreadystatechange = (e) => {
      if (Http.readyState == 4 && Http.status == 200) {
        let response = JSON.parse(Http.responseText)
        var result = []
        for (var i = 0; i < response['results'].length; i++) {
          result_json = {
            "name": response['results'][i]['name'],
            "ratings": response['results'][i]['ratings'],
            "types": response['results'][i]['types'],
            "location": response['results'][i]['geometry']['location']
          }
          result.push(result_json)
        }

        console.debug(result)
      }
    }
  }
  

  render() {
    return (
      <Button title="Query" onPress={this.places_search("Anime", 34.069819, -118.453163)}></Button>
    );
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
