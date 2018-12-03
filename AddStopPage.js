'use strict';

import React, { Component } from 'react';
import {
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
import { StopStorage } from './StopStorage';
import { StopRecommender } from './StopRecommender';
import LocationSuggestion from './components/LocationSuggestion';

import LocationList from './components/LocationList';
import StopSearchList from './components/StopSearchList';

global.stopStorage = new StopStorage();
global.StopRecommender = new StopRecommender();

export default class AddStopPage extends Component {
    constructor(props) {
        super(props);
        //this.stopStorage = new StopStorage();
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
            currentSearch: null, // current index on the stop array we are searching on, -1 for start, -2 for dest
            currentStops: [], //help for deletion later, holds json of stops
            stopSearchStrings: [], // holds the search strings for stops
            stopList: [{}],
            searchEditable: true,
            stopsToAdd: [], // for multiselecting stops to be pushed to into stopStorage
            recommendedStops: new Set(),
            showGenerateButton: true,
            destinationSet: false,
            startSearchString: "Current Location",
        };

    }


    /**
     * Given an address, change addressSuggestion in state to corresponding array of {address, ID}
     * @param {string} address Incomplete search terms
     */
    address_search = (address) => {
        const Http = new XMLHttpRequest();
        var url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" + encodeURIComponent(address) + "&key=AIzaSyAwnXWH-qrRpBWraATnVVyHxKYuRSZEQ8M&location=" + String(this.state.userLocation.latitude) + "," + String(this.state.userLocation.longitude);
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = e => {
            if (Http.readyState == 4 && Http.status == 200) {
                let response = JSON.parse(Http.responseText);
                var suggestions = [];
                response["predictions"].forEach(function (prediction) {
                    suggestions.push({ "Address": prediction['description'], "ID": prediction['place_id'] });
                });
                this.setState(
                    { addressSuggestions: suggestions }
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
        var url = "https://maps.googleapis.com/maps/api/place/details/json?placeid=" + encodeURIComponent(suggestionObj.ID) + "&key=AIzaSyAwnXWH-qrRpBWraATnVVyHxKYuRSZEQ8M";
        Http.open("GET", url);
        Http.send();
        Http.onreadystatechange = e => {
            if (Http.readyState == 4 && Http.status == 200) {
                this.state.addressSuggestions = [];
                this.state.startSearchString = suggestionObj.Address;
                let response = JSON.parse(Http.responseText);
                this.setState(
                    { addressResult: { "coordinates": { "latitude": response.result.geometry.location.lat, "longitude": response.result.geometry.location.lng } } }
                );
                this.setState({
                    startLocation: {
                        latitude: response.result.geometry.location.lat,
                        longitude: response.result.geometry.location.lng
                    }
                })
                global.stopStorage.setStart(this.state.addressResult.coordinates.latitude, this.state.addressResult.coordinates.longitude);

            }
        };
    };

    yelp_search = (search_str, latitude, longitude, radius) => {
        const Http = new XMLHttpRequest();
        var url = "https://api.yelp.com/v3/businesses/search?" + "term=" + encodeURIComponent(search_str) + "&latitude=" + String(latitude) + "&longitude=" + String(longitude);
        if (radius != undefined) {
            url = url + "&radius=" + String(radius);
        }
        console.log(url)
        Http.open("GET", url);
        Http.setRequestHeader('Authorization', 'Bearer ' + 'nMpM6dLuTMoyzu4q1dCBJPsSSSjqZ9UP7pTrRLbR5PSNni3wcHhZWKbAHRxYRhoosUdTkvmP5-D4HtAUbNLNXyensvOMaUw5nS_raYiV1raMvDNO5_t0-hF7GJH_W3Yx');
        Http.send();
        Http.onreadystatechange = (e) => {
            if (Http.readyState == 4 && Http.status == 200) {
                var response = JSON.parse(Http.responseText)

                var result = [];
                var recommend = this.state.recommendedStops;

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
                    let not_duplicate = true
                    for (let item of recommend) {
                        if (item.name == result_json.name) {
                            not_duplicate = false
                        }
                    }
                    if (not_duplicate) {
                        recommend.add(result_json)
                    }
                });

                this.setState({
                    isLoading: false,
                    textValue: JSON.stringify(result),
                    results: result,
                    recommendedStops: recommend
                });
                //console.log(this.state.results.length + " " + this.state.recommendedStops.size + " " + recommend.size)
                //for (let item of this.state.recommendedStops) console.log(item)
            }
        }
    }

    generate_stops = (stops, stopType) => {
        this.setState({
            recommendedStops: new Set()
        });
        // 180 is too small, rarely returns anything
        var radius = 180;
        var overlap = 110;
        // how far each search substop will be spaced apart
        var factor = 2 * radius - overlap;
        // for all stops, find substops and do yelp search for all of them
        for (let i = 1; i < stops.length; i++) {
            const Http = new XMLHttpRequest();
            // find the distance between each pair of stops, and calculate how many times to search on this section
            let mapURL = "https://maps.googleapis.com/maps/api/distancematrix/json?origins=" + String(stops[i - 1].latitude) + "," + String(stops[i - 1].longitude) + "&destinations=" + String(stops[i].latitude) + "," + String(stops[i].longitude) + "&key=AIzaSyAGujL9LLERhk4Y0N4R4Cbeqww14FDPR60";
            Http.open("GET", mapURL);
            Http.send();
            Http.onreadystatechange = e => {
                if (Http.readyState == 4 && Http.status == 200) {
                    let response = JSON.parse(Http.responseText);
                    // distance between the stops divided by the factor = how many times we will call yelp search on this section (# of substops)
                    let iterations = Math.round(response.rows[0].elements[0].distance.value / factor);
                    if (iterations < 1) {
                        iterations = 1;
                    }
                    //console.log(iterations)
                    // latitude difference/# of substops
                    let latDiff = (stops[i].latitude - stops[i - 1].latitude) / iterations;
                    // longitude difference/# of substops
                    let longDiff = (stops[i].longitude - stops[i - 1].longitude) / iterations;
                    // if stops are closer than 250m apart, only search the start
                    for (let j = 0; j < iterations; j++) {
                        // for each substop, make a yelp request
                        this.yelp_search(stopType, stops[i - 1].latitude + latDiff * j, stops[i - 1].longitude + longDiff * j, radius);
                    }
                }
            };
        }
    }

    _onSearchTextChanged1 = (event) => {
        //console.log('_onSearchTextChanged');
        this.setState({ startSearchString: event.nativeEvent.text, currentSearch: -1 });
        this.address_search(this.state.startSearchString);
        // console.log('Current: '+this.state.searchString+', Next: '+event.nativeEvent.text);
    };

    _onSearchPressed1 = () => {
        if (this.state.startSearchString === undefined || this.state.startSearchString == "") return;
        this.setState({ isLoading: true, currentSearch: -1 });
        this.address_search(this.state.startSearchString);
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
        this.yelp_search(this.state.stopSearchStrings[index], this.state.startLocation.latitude, this.state.startLocation.longitude);
        this.setState({ isLoading: true, currentSearch: index, searchEditable: false, showGenerateButton: false, }); // 0, 1, ... used for index in stopSearchStrings array
        console.log(this.state.routeSuggestions);
    };

    _onSearchTextChanged3 = (event) => {
        this.setState({ destSearchString: event.nativeEvent.text });
    };

    _onSearchPressed3 = () => {
        if (this.state.destSearchString === undefined || this.state.destSearchString == "") return;
        this.yelp_search(this.state.destSearchString, this.state.startLocation.latitude, this.state.startLocation.longitude);
        this.setState({ isLoading: true, currentSearch: -2 }); //-2 flag for destination
        console.log(this.state.routeSuggestions);
    };

    // testing
    /* 	_onSearchPressed3 = () => {
          if (this.state.destSearchString === undefined || this.state.destSearchString == "") return;
          var stops = [{latitude: 34.0689, longitude: 118.4452}, {latitude: 34.0635, longitude: 118.4455}, {latitude: 33.9416, longitude: 118.4085}]
          this.generate_stops(stops, this.state.destSearchString)
          this.setState({ isLoading: true, currentSearch: -2 }); //-2 flag for destination
        }; */

    getUserLocationHandler = () => {
        navigator.geolocation.getCurrentPosition(position => {
            this.setState({
                userLocation: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0622,
                    longitudeDelta: 0.0421,
                },
                startLocation: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                }
            });
            global.stopStorage.setStart(this.state.startLocation.latitude, this.state.startLocation.longitude);
        }, err => console.log(err));
    }

    onAddDest = (r) => {
        this.setState({ results: [] });
        let result = JSON.parse(r);
        this.state.destSearchString = result.name;
        this.state.destinationSet = true;
        global.stopStorage.setDestination(r);
    }

    onAddStop = (r) => {
        this.state.stopsToAdd.push(r);
    }

    onDeleteStop = (r) => {
        this.state.stopsToAdd.filter(json => json !== r);
    }

    onDone = () => {
        if (this.state.stopsToAdd.length !== 0) {
            global.stopStorage.addStop(this.state.stopsToAdd);
            this.state.currentStops[this.state.currentSearch] = this.state.stopsToAdd;
        }
        this.setState({ searchEditable: true, stopsToAdd: [], results: [], currentSearch: -1, showGenerateButton: true });
    }

    addStopSearchBar = (e) => {
        this.setState((prevState) => ({
            stopList: [...prevState.stopList, {}],
        }));
    }

    //    onStopEdit = (index) => {
    //        if(this.state.currentStops[index]){
    //            this.state.currentStops[index].forEach(function(j){
    //                global.stopStorage.deleteStopByJSON(j);
    //            })
    //            this.state.currentStops[index] = [];
    //          }
    //
    //    }

    removeStop = (index) => {
        if (this.state.currentStops[index]) {
            this.state.currentStops[index].forEach(function (j) {
                global.stopStorage.deleteStopByJSON(j);
            })
            this.state.currentStops[index] = [];
        }

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

    render() {
        const spinner = this.state.isLoading ? <ActivityIndicator size='large' /> : null;
        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={styles.planningBoard}>
                    <View style={styles.startSearchBar}>
                        <TextInput
                            style={styles.searchInput}
                            value={this.state.startSearchString}
                            onSubmitEditing={this._onSearchPressed1}
                            onChange={this._onSearchTextChanged1}
                            editable={this.state.searchEditable}
                            placeholder='Current Location' />
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
                        searchEditable={this.state.searchEditable}
                        removeFunc={this.removeStop} />
                    <View style={styles.destSearchBar}>
                        <TextInput autoFocus
                            style={styles.searchInput}
                            value={this.state.destSearchString}
                            onSubmitEditing={this._onSearchPressed3}
                            onChange={this._onSearchTextChanged3}
                            editable={this.state.searchEditable}
                            placeholder='Destination' />
                    </View>
                </View>
                <View style={styles.container}>
                    <LocationList addStop={this.onAddStop} deleteStop={this.onDeleteStop}
                        clickDone={this.onDone}
                        addDest={this.onAddDest} results={this.state.results}
                        addressSuggestions={this.state.addressSuggestions}
                        currentSearch={this.state.currentSearch}
                        toCoord={this.address_suggestion_to_coord}
                        stopsToAdd={this.state.stopsToAdd}
                    />
                </View>
                {this.state.showGenerateButton && this.state.destinationSet && <TouchableOpacity
                    style={styles.generateButton}
                    onPress={() => {
                        global.stopStorage.getAllStops();
                        this.props.navigation.navigate('RouteMap');
                    }}
                    underlayColor='#fff'>
                    <Text style={styles.generateButtonText}> Generate Route</Text>
                </TouchableOpacity>}
                {!this.state.showGenerateButton && <TouchableOpacity onPress={() => this.onDone()}
                    style={styles.doneButton}
                    underlayColor='#fff'>
                    <Text style={styles.doneButtonText}>Done</Text>
                </TouchableOpacity>}
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
        height: 370,
    },
    addStopButton: {
        marginTop: 10,
        marginRight: 5,
        marginLeft: 15
    },
    addStopButtonText: {
        textAlign: 'center',
        color: 'black',
        fontSize: 25,
    },
    generateButton: {
        marginTop: 540,
        marginLeft: '27%',
        backgroundColor: '#FF5E5E',
        borderRadius: 15,
        position: 'absolute',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 3,
    },
    generateButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
    },
    doneButton: {
        marginTop: 540,
        marginLeft: '32%',
        backgroundColor: '#FF5E5E',
        borderRadius: 15,
        position: 'absolute',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
        elevation: 3,
    },
    doneButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 10,
        paddingRight: 10,
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
