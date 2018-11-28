'use strict';

import React, { Component } from 'react';
import{
    StyleSheet,
    Text,
    TextInput,
    View,
    ActivityIndicator,
    Image,
    TouchableOpacity,
    Button
} from 'react-native';

import FetchLocation from './components/FetchLocation';
import UsersMap from './components/UsersMap';
import {StopStorage} from './StopStorage';
import LocationSuggestion from './components/LocationSuggestion';

import LocationList from './components/LocationList';
import StopSearchList from './components/StopSearchList';

global.stopStorage = new StopStorage();

export default class AddStopPage extends Component{
    constructor(props) {
      super(props);
      this.stopStorage = new StopStorage();
      this.getUserLocationHandler();

      // Below are examples of how to use stopStorage interface:
      this.yourCallBackFunctionHere = function (suggestedRoutes) {
        // Insert your logic here
        // un-set waiting screen set
        console.log(suggestedRoutes);
      }

      this.state = {
        isLoading: false,
        results: [],
        addressSuggestions: [],
        addressResult: null,
        userLocation: null,
        currentSearch: null,
        currentSearchResult: null,
        currentStops: [], //help for deletion later, holds json of stops
        stopSearchStrings: [], // holds the search strings for stops
        stopList: [{}],
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

  address_suggestion_to_coord = (suggestion) => {
    this.setState(
      { addressResult: null }
    );
    var suggestionObj = JSON.parse(suggestion);
    const Http = new XMLHttpRequest();
    var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + encodeURIComponent(suggestionObj.place_id) + "&key=AIzaSyAwnXWH-qrRpBWraATnVVyHxKYuRSZEQ8M";
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange = e => {
      if (Http.readyState == 4 && Http.status == 200) {
        let response = JSON.parse(Http.responseText);
        this.setState(
          { addressResult: {"coordinates": {"latitude": response.geometry.location.lat, "longitude": response.geometry.location.lng}}}
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
      this.setState({ startSearchString: event.nativeEvent.text });
      // console.log('Current: '+this.state.searchString+', Next: '+event.nativeEvent.text);
    };

    _onSearchPressed1 = () => {
      if (this.state.startSearchString === undefined || this.state.startSearchString == "") return;
      this.yelp_search(this.state.startSearchString, +34.06893, -118.445127);
      this.setState({ isLoading: true, currentSearch: -1 });
      console.log(this.state.routeSuggestions);
    };

    _onSearchTextChanged2 = (index, event) => {
      if (this.state.stopSearchStrings[index] === undefined || this.state.stopSearchStrings[index] === "")
        this.state.stopSearchStrings[index] = event.nativeEvent.text;
      else {
        this.setState({
          stopSearchStrings: this.state.stopSearchStrings.map((val, _index) => {
            if (_index === index) return event.nativeEvent.text;
            else return val;
          }),
        });
      }
    };

    _onSearchPressed2 = (index) => {
      if (this.state.stopSearchStrings[index] === undefined || this.state.stopSearchStrings[index] == "") return;
      this.yelp_search(this.state.stopSearchStrings[index], +34.06893, -118.445127);
      this.setState({ isLoading: true, currentSearch: index }); // 0, 1, ... used for index in stopSearchStrings array
      console.log(this.state.routeSuggestions);
    };

    _onSearchTextChanged3 = (event) => {
      this.setState({ destSearchString: event.nativeEvent.text });
    };

    _onSearchPressed3 = () => {
      if (this.state.destSearchString === undefined || this.state.destSearchString == "") return;
      this.yelp_search(this.state.destSearchString, +34.06893, -118.445127);
      this.setState({ isLoading: true, currentSearch: -2 }); //-2 flag for destination
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

    onAddStop = (r) => {
        this.setState({currentSearchResult: r, results: []});
        let result = JSON.parse(r);
        if(this.state.currentSearch === -1){ // start point
            this.state.startSearchString = result.name;
            //set start
        }
        else if(this.state.currentSearch === -2){ //destination
            this.state.destSearchString = result.name;
            this.stopStorage.setDestination(r);
        }
        else{ // stops
            this.state.stopSearchStrings[this.state.currentSearch] = result.name;
            this.state.currentStops[this.state.currentSearch] = r;
            this.stopStorage.addStop(r);
        }
    }

    addStopSearchBar = (e) => {
      this.setState((prevState) => ({
        stopList: [...prevState.stopList, {}],
      }));
    }

    removeStop = (index) => {
      this.setState({
        stopList: this.state.stopList.filter((item, _index1) => index !== _index1),
        stopSearchStrings: this.state.stopSearchStrings.filter((val, _index2) => index !== _index2)
      });
    }

    //             <Button onPress={() => {
    //               // Example of using stopStorage
    // //              var yelpJsonReturnString = '{"coordinates": {"latitude":34.069872,"longitude":-118.453163}}';
    // //              this.stopStorage.setStart(34.069872, -118.453163); // Can be initialized with GPS coordinatrs - Koyoshi's Apartment
    // //              this.stopStorage.setStart(yelpJsonReturnString); // Can also initialized Yelp Fusion API
    // //              this.stopStorage.setDestination("{\"coordinates\": {\"latitude\":34.063596,\"longitude\":-118.444074}}"); // Can only be set through Yelp Fusion API json value
    // //              this.stopStorage.addStop("{\"coordinates\": {\"latitude\":34.069196,\"longitude\":-118.445722}}"); // Can add a stop with Yelp Fusion API json return string
    // //              this.stopStorage.addStop(["{\"coordinates\": {\"latitude\":34.074550,\"longitude\":-118.438659}}"]); // Can also add a selection of stops (candidates) in a list of Yelp Fusion API json
    // //              this.stopStorage.getSuggestion(this.yourCallBackFunctionHere);
    // //              // Display UI waiting screen
    // //              console.log(this.stopStorage.getAllStops()); // Sorted
    // //              this.stopStorage.deleteStopByCoordinate(34.069196, -118.445722);
    // //              console.log(this.stopStorage.getAllStops()); // The above stop will be deleted;
    // //              this.stopStorage.addStop("{\"coordinates\": {\"latitude\":34.069196,\"longitude\":-118.445722}}");
    // //              this.stopStorage.deleteStopByJSON('{"coordinates": {"latitude":34.063596,"longitude":-118.444074}}');
    // //              this.stopStorage.getSuggestion(this.yourCallBackFunctionHere); // Suggested route will be updated
    // //              // Display UI waiting screen
    // //              console.log(this.stopStorage.getStart());
    // //              console.log(this.stopStorage.getDestination());
    //
    //                 this.stopStorage.getAllStops();
    //             }} title="Generate Route" style={styles.generateButton} color='#FF0000'/>

    render(){
        const spinner = this.state.isLoading ? <ActivityIndicator size='large'/> : null;
        return (
          <View style={{flex: 1, backgroundColor: 'white'}}>
            <View style={styles.planningBoard}>
              <View style={styles.startSearchBar}>
                <TextInput
                  style={styles.searchInput}
                  value={this.state.startSearchString}
                  onSubmitEditing={this._onSearchPressed1}
                  onChange={this._onSearchTextChanged1}
                  placeholder='Current Location'/>
                <TouchableOpacity
                  style={styles.addStopButton}
                  onPress={this.addStopSearchBar}>
                  <Text style={styles.addStopButtonText}>+</Text>
                </TouchableOpacity>
              </View>
              <StopSearchList stops={this.state.stopList}
                              searchString={this.state.stopSearchStrings}
                              changeFunc={this._onSearchTextChanged2}
                              submitFunc={this._onSearchPressed2}
                              removeFunc={this.removeStop}/>
              <View style={styles.destSearchBar}>
                <TextInput autoFocus
                  style={styles.searchInput}
                  value={this.state.destSearchString}
                  onSubmitEditing={this._onSearchPressed3}
                  onChange={this._onSearchTextChanged3}
                  placeholder='Destination'/>
              </View>
            </View>
            <View style={styles.container}>
                {/*<Text>{this.state.textValue}</Text>*/}
                <LocationList addStop={this.onAddStop} results={this.state.results}/>
            </View>
            <TouchableOpacity
              style={styles.generateButton}
              onPress={() => {this.stopStorage.getAllStops();}}
              underlayColor='#fff'>
              <Text style={styles.generateButtonText}> Generate Route</Text>
            </TouchableOpacity>
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
        marginTop: 10,
        marginLeft: 20,
        marginRight: 20,
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 6,
        height: 400,
      },
      addStopButton:{
        marginTop: 10,
        marginRight: 5,
        marginLeft: 15
      },
      addStopButtonText:{
        textAlign:'center',
        color: 'black',
        fontSize: 25,
      },
      generateButton:{
        marginTop: 540,
        // marginLeft: 115,
        marginLeft: '27%',
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor:'#FF5E5E',
        borderRadius: 15,
        position: 'absolute',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
      },
      generateButtonText:{
        color:'#fff',
        fontSize: 17,
        fontWeight: 'bold',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10,
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
        // shadowOffset: { width: 2, height: 5 },
        // shadowOpacity: 0.2,
        // shadowRadius: 2,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
        zIndex: 10,
      },
      startSearchBar: {
        flexDirection: 'row',
      },
      destSearchBar: {
        flexDirection: 'row',
        marginRight: 35,
        marginBottom: 25,
      },
      searchInput: {
        marginLeft: 20,
        padding: 15,
        fontSize: 17,
        borderBottomColor: '#9B9B9B',
        borderBottomWidth: 0.5,
        textAlign: 'left',
        flex: 3
      },
      map: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
      }

    });
