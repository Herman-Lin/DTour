'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    ActivityIndicator,
    Image,
    TouchableOpacity,
} from 'react-native';

import FetchLocation from './components/FetchLocation';
import UsersMap from './components/UsersMap';
import { StopStorage } from './StopStorage';
import LocationSuggestion from './components/LocationSuggestion';
import { createStackNavigator } from 'react-navigation';

import LocationList from './components/LocationList';
import Polyline from '@mapbox/polyline';


export default class SearchPage extends Component{
    constructor(props) {
      super(props);
      this.getUserLocationHandler(); //get user location at startup
      this.state = {
        isLoading: false,
        textValue: 'JSON response will be shown',
        results: [],
        addressSuggestions: [],
        userLocation: null,//{latitude: 34.0689, longitude: -118.445},
        userDestination: null,
        coords: [],
        concat: null,
        
      };

      this.mergeLot = this.mergeLot.bind(this);
    }

    // /**
    //  * Given an address, change addressSuggestion in state to corresponding array of {address, ID}
    //  * @param {string} address Incomplete search terms
    //  */
    // address_search = (address) => {
    //   const Http = new XMLHttpRequest();
    //   var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + encodeURIComponent(address) + "&key=AIzaSyAwnXWH-qrRpBWraATnVVyHxKYuRSZEQ8M&location=" + String(this.state.latitude) + "," + String(this.state.longitude);
    //   Http.open("GET", url);
    //   Http.send();
    //   Http.onreadystatechange = e => {
    //     if (Http.readyState == 4 && Http.status == 200) {
    //       let response = JSON.parse(Http.responseText);
    //       var suggestions = [];
    //       response["predictions"].forEach(function (prediction) {
    //         result.push({"Address": prediction['description'], "ID": prediction['place_id']});
    //       });
    //       this.setState(
    //         {addressSuggestions: suggestions}
    //       );
    //     }
    //   };
    // };

    // yelp_search = (search_str, latitude, longitude) => {
    //   const Http = new XMLHttpRequest();
    //   var url = "https://api.yelp.com/v3/businesses/search?" + "term=" + encodeURIComponent(search_str) + "&latitude=" + String(latitude) + "&longitude=" + String(longitude);
    //   Http.open("GET", url);
    //   Http.setRequestHeader('Authorization', 'Bearer ' + 'ngBHhApCaTwA0HfEvloYx0N57iWuE3TW1OkKRZ74PKbfDyZBThUWZHemHJ3LeltzP6NQ1dP3leLIepkqVxIkUX7R5xjNBo4vznjOZuOZVFMbgCWWEyxrZHuNNujUW3Yx');
    //   Http.send();
    //   Http.onreadystatechange = (e) => {
    //     if (Http.readyState == 4 && Http.status == 200) {
    //       var response = JSON.parse(Http.responseText)

    //       var result = [];
          
    //       response['businesses'].forEach(function (business) {
    //         var result_json = {
    //           "name": business['name'],
    //           "image_url": business['image_url'],
    //           "is_closed": business['is_closed'],
    //           "review_count": business['review_count'],
    //           "categories": business['categories'],
    //           "rating": business['rating'],
    //           "coordinates": business['coordinates'],
    //           "price": business['price'],
    //           "location": business['location'],
    //         }
    //         result.push(result_json)
    //       });

    //       this.setState({
    //         isLoading: false,
    //         textValue: JSON.stringify(result),
    //         results: result
    //       });
    //     }
    //   }
    // }

    // _onSearchTextChanged = (event) => {
    //   //console.log('_onSearchTextChanged');
    //   this.setState({ searchString: event.nativeEvent.text });
    //   //console.log('Current: '+this.state.searchString+', Next: '+event.nativeEvent.text);
    // };

    // _onSearchPressed = () => {
    //   if (this.state.searchString === undefined || this.state.searchString == "") return;
    //   this.yelp_search(this.state.searchString, +34.06893, -118.445127);
    //   this.setState({ isLoading: true });
    //   console.log(this.state.routeSuggestions);
    // };



    getUserLocationHandler = () => {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0622,
            longitudeDelta: 0.0421,
          },

          userDestination: {
            latitude: 35.0000,
            longitude: -119.000,
            //latitudeDelta: 0.0622,
            //longitudeDelta: 0.0421,
          }
        });
        this.mergeLot();
      }, err => console.log(err));
    }


    mergeLot(){
      if (this.state.userLocation.latitude != null && this.state.userLocation.longitude!=null)
       {
         let concatLot = this.state.userLocation.latitude +","+ this.state.userLocation.longitude
        console.log(concatLot)
         this.setState({
           concat: concatLot
         }, () => {
           this.getDirections(concatLot, "34.0679,-118.555");
         });
       }
  
     }

  
  async getDirections(startLoc, destinationLoc) {
    console.log(startLoc, destinationLoc)
    try {
      //let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }`)
      console.log(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=AIzaSyAGujL9LLERhk4Y0N4R4Cbeqww14FDPR60`)
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=AIzaSyAGujL9LLERhk4Y0N4R4Cbeqww14FDPR60`)
      let respJson = await resp.json();
      console.log(respJson);
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
          return  {
              latitude : point[0],
              longitude : point[1]
          }
      })

      console.log(coords)
      this.setState({coords: coords})
      return coords
    } catch(error) {
      alert(error)
      return error
   }
  }
    
    render(){

        console.log(this.state.routeSuggestions);
        return (
          <View>
            <View>
              <UsersMap userLocation={this.state.userLocation} destinationLocation={this.state.userDestination} coordinates={this.state.coords}/>
            </View>        
            <View style={styles.flowRight}>
              <TextInput
                style={styles.searchInput}
                value={this.state.searchString}
                onFocus={() => this.props.navigation.navigate('AddStop')}
                placeholder='Where to?'/>
            </View>  
          </View>
        );
    }
}


const styles = StyleSheet.create({
      description: {
        marginBottom: 5,
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
      },
      flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        zIndex: 100
      },
      searchInput: {
        height: 50,
        padding: 10,
        marginTop: 80,
        marginLeft: 20,
        marginRight: 20,
        flexGrow: 1,
        fontSize: 17,
        color: 'black',
        backgroundColor: 'white',
        borderRadius: 6,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 2
      },
      map: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
      }

    });