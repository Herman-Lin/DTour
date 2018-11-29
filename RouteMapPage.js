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
import { Icon } from 'react-native-elements';

import FetchLocation from './components/FetchLocation';
import UsersMap from './components/UsersMap';
import { StopStorage } from './StopStorage';
import LocationSuggestion from './components/LocationSuggestion';
import { createStackNavigator } from 'react-navigation';

import LocationList from './components/LocationList';
import AddStopPage from './AddStopPage';

import Polyline from '@mapbox/polyline';


export default class RouteMapPage extends Component{
    constructor(props) {
      super(props);
      this.getUserLocationHandler(); //get user location at startup
      this.state = {
        
        isLoading: false,
     
        results: [],
        addressSuggestions: [],
        userLocation: null,//{latitude: 34.0689, longitude: -118.445},
        destination: null,
        userDestination: null,
        startLocation: null,
        coords: [],
        concat: null,
        displayRoute: 1,

        dummyDestination: "34.0679,-118.555",
        dummyValues: [{latitude: 34.0689, longitude: -118.455},
          {latitude: 34.0689, longitude: -118.430}],

        suggestions: null,
        suggestionsPolyline: null,
        
      };
      this.getSuggestionCallback = this.getSuggestionCallback.bind(this);
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
        
        if (this.state.displayRoute == 1){
          this.mergeLot();
        }
       // this.checkRoute();
      }, err => console.log(err));
    }


    getSuggestionCallback(suggestions) {
      
        console.log(suggestions);
      this.setState({
        suggestions: suggestions,
        suggestionsPolyline: suggestions[0].polyline,
      });

      let points = Polyline.decode(suggestions[0].polyline);
      
      let coords = points.map((point, index) => {
          return  {
              latitude : point[0],
              longitude : point[1]
          }
      })

      this.setState({
        coords: coords,
      })

      let stops = suggestions[0].coordinates;
      
     
      let wayPoints = stops.map((point, index) => {
          return{
            latitude: point.getLatitude(),
            longitude: point.getLongitude(),

          }
      })
      
      this.setState({
        wayPoints: wayPoints,
      })
      console.log(suggestions[0])



      
    }

    mergeLot(){
      let start = global.stopStorage.getStart();
      let destination = global.stopStorage.getDestination();
      let suggestions = []
      global.stopStorage.getSuggestion(this.getSuggestionCallback);

      console.log(start, destination);


      /*
      
      if (start != null && destination != null) {
        this.setState(
          {
            startLocation: {start},
            destination: {destination},  
          }
        )
      }

      if (this.state.userLocation.latitude != null && this.state.userLocation.longitude!=null)
       {
         let concatLot = this.state.userLocation.latitude +","+ this.state.userLocation.longitude
        console.log(concatLot)
         this.setState({
           concat: concatLot
         }, () => {
           console.log(this.state.dummyDestination)
           this.getDirections(concatLot, this.state.dummyDestination, this.state.dummyValues);
         });
       }
  */
     }

  
  async getDirections(startLoc, destinationLoc, wayPoints) {
    console.log(startLoc, destinationLoc)
    try {
      let resp = null
      if  (wayPoints){
         resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=AIzaSyAGujL9LLERhk4Y0N4R4Cbeqww14FDPR60`)

      }
      else {
         resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${ startLoc }&destination=${ destinationLoc }&key=AIzaSyAGujL9LLERhk4Y0N4R4Cbeqww14FDPR60`)
      }
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


    checkRoute(){
      console.log(stopStorage.getDestination())
    }
    
    prepareRoute(){
      let startLoc
    }


    render(){

        
        return (
          <View>
            <View>
              <UsersMap userLocation={this.state.userLocation} destinationLocation={this.state.userDestination} coordinates={this.state.coords} displayRoute={this.state.displayRoute} wayPoints={this.state.wayPoints}/>
            </View> 
                

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      
                      this.props.navigation.navigate('AddStop'); //navigate back to Home screen 
                    }}
                    underlayColor='#fff'>
              <Icon name={"chevron-left"}  size={40} color="#fff" />
                
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
      flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        zIndex: 100
      },
      
      backButton:{
        
        marginTop: 30,
        // marginLeft: 115,
        marginLeft: '3%',
        paddingTop: 5,
        paddingBottom: 5,
        backgroundColor:'#FF5E5E',
        borderRadius: 100,
        position: 'absolute',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 3,
      },
      backButtonText:{
        color:'#fff',
        fontSize: 17,
        fontWeight: 'bold',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10,
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