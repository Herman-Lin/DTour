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
    Dimensions,
    ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';

import UsersMap from './components/UsersMap';
import { StopStorage } from './StopStorage';

import { createStackNavigator } from 'react-navigation';

import LocationList from './components/LocationList';
import AddStopPage from './AddStopPage';

import Polyline from '@mapbox/polyline';

import Carousel from 'react-native-snap-carousel';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
        carouselInformation: [],
        focusRegion: null,
        
      };
      this.getSuggestionCallback = this.getSuggestionCallback.bind(this);
      this.mergeLot = this.mergeLot.bind(this);
      this.carouselRender = this.carouselRender.bind(this);
      this.focusRegion = this.focusRegion.bind(this);
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
          focusRegion: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.0622,
            longitudeDelta: 0.0421,
          },
          userDestination: {
            latitude: 35.0000,
            longitude: -119.000,
          }
        });
        
        if (this.state.displayRoute == 1){
          this.mergeLot();
        }
      
      }, err => console.log(err));
    }


    getSuggestionCallback(suggestions) {
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
      
     
      let carousel = []
      let i=0
      for (i=0; i < stops.length; i++){
        if (stops[i].hasOwnProperty('info')){
          carousel.push({
            name: stops[i].info.name,
            image_url: stops[i].info.image_url,
            latitude: stops[i].latitude,
            longitude: stops[i].longitude,
          })
        }
      }
      let wayPoints = stops.map((point, index) => {
          return{
            latitude: point.getLatitude(),
            longitude: point.getLongitude(),

          }
      });
     
      this.setState({
        wayPoints: wayPoints,
        carouselInformation: carousel,
      });
      console.log(this.state.carouselInformation);
      
      console.log(suggestions[0]);

    };

    mergeLot(){
      let start = global.stopStorage.getStart();
      let destination = global.stopStorage.getDestination();
      let suggestions = []
      global.stopStorage.getSuggestion(this.getSuggestionCallback);

      console.log(start, destination);
    }

    
    carouselRender({item, index}) {
        return (
            <View style={styles.card}>
                <Text style={styles.cardText}>{ item.name}</Text>
                <Image style={styles.image} source={{uri: item.image_url}}/>
            </View>
        );
        
    };


    focusRegion() {
      let i = this.refs.carousel.currentIndex;
      let focus = this.state.carouselInformation[i];
      this.setState({
        focusRegion: {latitude: focus.latitude, longitude: focus.longitude, latitudeDelta: 0.0622,
          longitudeDelta: 0.0421,}

      })

      console.log(this.state.focusRegion)
    };   
    
   

  

    render(){

        
        return (
          <View>
            <View>
              <UsersMap userLocation={this.state.userLocation}
                        destinationLocation={this.state.userDestination} 
                        coordinates={this.state.coords} 
                        displayRoute={this.state.displayRoute} 
                        wayPoints={this.state.wayPoints}
                        focusRegion={this.state.focusRegion}/>
            </View> 
                

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      
                      this.props.navigation.navigate('AddStop'); //navigate back to Home screen 
                    }}
                    underlayColor='#fff'>
                  <Icon name={"chevron-left"}  size={40} color="#fff" />
                
                </TouchableOpacity>
            
            <View style={styles.cardContainer}>
              <Carousel 
                  data={this.state.carouselInformation} 
                  windowSize={1} 
                  sliderWidth={windowWidth}
                  itemHeight={windowHeight * .3} 
                  itemWidth={windowWidth *.9} 
                  renderItem={this.carouselRender} 
                  layout={"stack"} 
                  onScroll={this.focusRegion}
                  ref={'carousel'}/>
            </View>

          </View>


        );
    }
}

//<Carousel layout={'default'} />

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
        backgroundColor:'#000',
        opacity: 0.4,
        borderRadius: 100,
        position: 'absolute',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 100,
        shadowRadius: 3,
      },
      backButtonText:{
        color:'#000',
        fontSize: 17,
        fontWeight: 'bold',
        textAlign:'center',
        paddingLeft : 10,
        paddingRight : 10,
      },
  
      map: {
        width: '100%',
        height: '100%',
        alignItems: 'center'
      },

      card: {
        
        height: windowHeight* .25,
        width: windowWidth*.7,
        borderRadius: 6,
        backgroundColor: '#000000',
      },
      cardContainer: {
        marginLeft: '10%',
        marginTop: 450,
        alignItems: 'center',
        width: '100%',
        height: windowHeight *.4,
        paddingVertical: 20,
        
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 10
      },
      image: {
        borderRadius: 6,
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        opacity: 0.5,
      },
      
      cardText: {
        color: '#FFF',
        fontSize: 20,
        marginTop: 110,
        marginLeft: 10,
      }

    });