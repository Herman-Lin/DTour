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
} from 'react-native';

import FetchLocation from './components/FetchLocation';
import UsersMap from './components/UsersMap';
import {StopStorage} from './StopStorage';
import LocationSuggestion from './components/LocationSuggestion';

import LocationList from './components/LocationList';

export default class SearchPage extends Component{
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

    _onSearchTextChanged = (event) => {
      //console.log('_onSearchTextChanged');
      this.setState({ searchString: event.nativeEvent.text });
      //console.log('Current: '+this.state.searchString+', Next: '+event.nativeEvent.text);
    };


    _onSearchPressed = () => {
      if (this.state.searchString === undefined || this.state.searchString == "") return;
      this.yelp_search(this.state.searchString, +34.06893, -118.445127);
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


    //static navigationOptions ={
    //    title: 'Dtour',
    //};

    render(){
        const spinner = this.state.isLoading ? <ActivityIndicator size='large'/> : null;
        //console.log('SearchPage.render');
        return (
          <View>
            <View>
              <UsersMap userLocation={this.state.userLocation}/>
            </View>

            <View style={styles.container}>
                
                <View style={styles.flowRight}>
                  <TextInput
                    style={styles.searchInput}
                    value={this.state.searchString}
                    onChange={this._onSearchTextChanged}
                    placeholder='Where to?'/>
                  <Button
                    onPress={this._onSearchPressed}
                    color='#FF0800'
                    title='Go'
                  />
                  {spinner}
                </View>
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
        padding:10,
        marginTop: 65,
        marginLeft: 10,
        marginRight: 10,
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 3,
      },
      flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
      },
      searchInput: {
        height: 36,
        padding: 4,
        marginTop: 10,
        marginRight: 5,
        flexGrow: 1,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#FF0800',
        borderRadius: 3,
        color: '#FF0800',
        backgroundColor: '#FFFFFF',
       
      },
      map: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
      }

    });