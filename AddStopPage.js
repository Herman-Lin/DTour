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
import {StopStorage} from './StopStorage';
import LocationSuggestion from './components/LocationSuggestion';

import LocationList from './components/LocationList';

export default class AddStopPage extends Component{
    constructor(props) {
      super(props);
      this.stopStorage = new StopStorage(); 
      this.getUserLocationHandler(); //get user location at startup
      this.stopStorage.setStart(34.069872, -118.453163);
      this.stopStorage.setDestination("{\"coordinates\": {\"latitude\":34.063596,\"longitude\":-118.444074}}");
      this.stopStorage.addStop(["{\"coordinates\": {\"latitude\":34.069196,\"longitude\":-118.445722}}"]);
      this.stopStorage.addStop(["{\"coordinates\": {\"latitude\":34.074550,\"longitude\":-118.438659}}"]);
      this.state = {
        isLoading: false,
        textValue: 'JSON response will be shown',
        results: [],
        addressSuggestions: [],
        userLocation: null,
        routeSuggestions: this.stopStorage.getSuggestion(),
        searchString1: "",
        searchString2: "",
        searchString3: ""
      };
    }

    /**
     * Given an address, change addressSuggestion in state to corresponding array of {address, ID}
     * @param {string} address Incomplete search terms
     */
    address_search = (address) => {
      const Http = new XMLHttpRequest();
      var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + encodeURIComponent(address) + "&key=AIzaSyAwnXWH-qrRpBWraATnVVyHxKYuRSZEQ8M&location=" + String(this.state.latitude) + "," + String(this.state.longitude);
      Http.open("GET", url);
      Http.send();
      Http.onreadystatechange = e => {
        if (Http.readyState == 4 && Http.status == 200) {
          let response = JSON.parse(Http.responseText);
          var suggestions = [];
          response["predictions"].forEach(function (prediction) {
            result.push({"Address": prediction['description'], "ID": prediction['place_id']});
          });
          this.setState(
            {addressSuggestions: suggestions}
          );
        }
      };
    };

    yelp_search = (search_str, latitude, longitude) => {
      const Http = new XMLHttpRequest();
      var url = "https://api.yelp.com/v3/businesses/search?" + "term=" + encodeURIComponent(search_str) + "&latitude=" + String(latitude) + "&longitude=" + String(longitude);
      Http.open("GET", url);
      Http.setRequestHeader('Authorization', 'Bearer ' + 'ngBHhApCaTwA0HfEvloYx0N57iWuE3TW1OkKRZ74PKbfDyZBThUWZHemHJ3LeltzP6NQ1dP3leLIepkqVxIkUX7R5xjNBo4vznjOZuOZVFMbgCWWEyxrZHuNNujUW3Yx');
      Http.send();
      Http.onreadystatechange = (e) => {
        if (Http.readyState == 4 && Http.status == 200) {
          var response = JSON.parse(Http.responseText)

          var result = [];
          
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

          this.setState({
            isLoading: false,
            textValue: JSON.stringify(result),
            results: result
          });
        }
      }
    }

    _onSearchTextChanged1 = (event) => {
      //console.log('_onSearchTextChanged');
      this.setState({ searchString1: event.nativeEvent.text });
      // console.log('Current: '+this.state.searchString+', Next: '+event.nativeEvent.text);
    };

    _onSearchPressed1 = () => {
      if (this.state.searchString1 === undefined || this.state.searchString1 == "") return;
      this.yelp_search(this.state.searchString1, +34.06893, -118.445127);
      this.setState({ isLoading: true });
      console.log(this.state.routeSuggestions);
    };

    _onSearchTextChanged2 = (event) => {
      this.setState({ searchString2: event.nativeEvent.text });
    };

    _onSearchPressed2 = () => {
      if (this.state.searchString2 === undefined || this.state.searchString2 == "") return;
      this.yelp_search(this.state.searchString2, +34.06893, -118.445127);
      this.setState({ isLoading: true });
      console.log(this.state.routeSuggestions);
    };

    _onSearchTextChanged3 = (event) => {
      this.setState({ searchString3: event.nativeEvent.text });
    };

    _onSearchPressed3 = () => {
      if (this.state.searchString3 === undefined || this.state.searchString3 == "") return;
      this.yelp_search(this.state.searchString3, +34.06893, -118.445127);
      this.setState({ isLoading: true });
      console.log(this.state.routeSuggestions);
    };

    getUserLocationHandler = () => {
      navigator.geolocation.getCurrentPosition(position => {
        this.setState({
          userLocation: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0622,
            longitudeDelta: 0.0421,
          }
        });
      }, err => console.log(err));
    }

    render(){
        const spinner = this.state.isLoading ? <ActivityIndicator size='large'/> : null;
        return (
          <View>                 
            <View style={styles.planningBoard}>
              <TextInput
                style={styles.searchInput}
                value={this.state.searchString1}
                onSubmitEditing={this._onSearchPressed1}
                onChange={this._onSearchTextChanged1}
                placeholder='Current Location'/>
              <TextInput
                style={styles.searchInput}
                value={this.state.searchString2}
                onSubmitEditing={this._onSearchPressed2}
                onChange={this._onSearchTextChanged2}
                placeholder='Add a Stop'/>
              <TextInput autoFocus
                style={styles.searchInput}
                value={this.state.searchString3}
                onSubmitEditing={this._onSearchPressed3}
                onChange={this._onSearchTextChanged3}
                placeholder='Destination'/>
            </View>
            <View style={styles.container}>
                {/*<Text>{this.state.textValue}</Text>*/}
                <LocationList results={this.state.results}/>
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
      container: {
        marginTop: -18,
        marginLeft: 20,
        marginRight: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 6
      },
      flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        zIndex: 100
      },
      planningBoard: {
        marginTop: 25,
        marginLeft: 20,
        marginRight: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 2
      },
      searchInput: {
        padding: 15,
        fontSize: 17,
        borderBottomColor: '#9B9B9B',
        borderBottomWidth: 0.5
      },
      map: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
      }

    });