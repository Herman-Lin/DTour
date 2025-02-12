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
        // addressSuggestions: [],
        userLocation: null,//{latitude: 34.0689, longitude: -118.445},
        userDestination: null,
        coords: [],
        concat: null,
        displayRoute: 0,

        dummyValues: [{latitude: 34.0689, longitude: -118.455},
          {latitude: 34.0689, longitude: -118.430}],
        
      };

      this.mergeLot = this.mergeLot.bind(this);
    }


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
       // this.checkRoute();
      }, err => console.log(err));
    }


    mergeLot(){
      if (this.state.userLocation.latitude != null && this.state.userLocation.longitude!=null)
       {
         let concatLot = this.state.userLocation.latitude +","+ this.state.userLocation.longitude
         this.setState({
           concat: concatLot
         }, () => {
           this.getDirections(concatLot, "34.0679,-118.555");
         });
       }
  
     }

  
  async getDirections(startLoc, destinationLoc) {
    try {

      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=AIzaSyAGujL9LLERhk4Y0N4R4Cbeqww14FDPR60`)
      let respJson = await resp.json();
      let points = Polyline.decode(respJson.routes[0].overview_polyline.points);
      let coords = points.map((point, index) => {
          return  {
              latitude : point[0],
              longitude : point[1]
          }
      })
      this.setState({coords: coords})
      return coords
    } catch(error) {
      alert(error)
      return error
   }
  }
  
    checkRoute(){
      // console.log(stopStorage.getDestination())
    }
    
    render(){

        
        return (
          <View>
            <View>
              <UsersMap userLocation={this.state.userLocation} destinationLocation={this.state.userDestination} coordinates={this.state.coords} displayRoute={this.state.displayRoute} wayPoints={this.state.wayPoints}/>
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