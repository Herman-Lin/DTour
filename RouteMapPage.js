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
        suggestionLength: 0,
        suggestionIndex: 0,
        carouselInformation: [],
        focusRegion: null,

      };
      this.getSuggestionCallback = this.getSuggestionCallback.bind(this);
      this.mergeLot = this.mergeLot.bind(this);
      this.carouselRender = this.carouselRender.bind(this);
      this.focusRegion = this.focusRegion.bind(this);
      this.incrementSuggestionIndex = this.incrementSuggestionIndex.bind(this);
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


      if (this.state.suggestions == null){
        console.log(this.state.suggestionIndex)
        console.log(suggestions)
        this.setState({
          suggestions: suggestions,
          suggestionsPolyline: suggestions[this.state.suggestionIndex].polyline,
          suggestionLength: suggestions.length,
        });
        }
  
        else {
          this.setState({
            suggestionsPolyline: this.state.suggestions[this.state.suggestionIndex].polyline,
            suggestionLength: this.state.suggestions.length,
          });
        }

      let points = Polyline.decode(this.state.suggestions[this.state.suggestionIndex].polyline);

      let coords = points.map((point, index) => {
          return  {
              latitude : point[0],
              longitude : point[1]
          }
      })

      this.setState({
        coords: coords,
      })

      let stops = this.state.suggestions[this.state.suggestionIndex].coordinates;


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
      //console.log(this.state.carouselInformation);

      //console.log(suggestions[0]);

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
        focusRegion: {latitude: focus.latitude, longitude: focus.longitude, latitudeDelta: 0.0022,
          longitudeDelta: 0.0021,}

      })

      console.log(this.state.focusRegion)
    };

      //onPress method for generating new route
      incrementSuggestionIndex() {
        console.log(this.state.suggestionLength);
        let index = this.state.suggestionIndex;
        let length = this.state.suggestionLength;
        if (index < (length - 1)){
          this.setState({
            suggestionIndex: index + 1,
            
          });
          this.mergeLot();
        }
  
        else{
          this.setState({
            suggestionIndex: 0,
          })
          this.mergeLot();
        }
  
      }





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
            <View style={styles.header}>
              <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => {
                    this.props.navigation.navigate('AddStop'); //navigate back to Home screen
                  }}>
                <Icon name={"chevron-left"}  size={40} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                    style={styles.generateRouteButton}
                    onPress={() => {
                      this.incrementSuggestionIndex();
                      console.log(this.state.suggestionIndex);
    
                    }}
                    underlayColor='#fff'>
                  <Icon name={"cached"}  size={40} color="#000" />
                
                </TouchableOpacity>
              <Text style={styles.headerTitle}>Your Trip</Text>
            </View>
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
      header: {
        flexDirection: 'row',
      },
      headerTitle: {
        marginLeft: 145,
        marginTop: 23,
        fontWeight: 'bold',
        fontSize: 18,
        position: 'absolute',
      },
      generateRouteButton: {
        marginTop: 30,
        marginLeft: '87%',
        marginRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
        // backgroundColor:'#000',
        // opacity: 0.4,
        // borderRadius: 100,
        position: 'absolute',
        // shadowOffset: { width: 2, height: 5 },
        // shadowOpacity: 100,
        // shadowRadius: 3,
       
      },
      backButton:{
        marginTop: 10,
        marginLeft: 10,
        paddingTop: 5,
        paddingBottom: 5,
        // backgroundColor:'#000',
        // opacity: 0.4,
        // borderRadius: 100,
        position: 'absolute',
        // shadowOffset: { width: 2, height: 5 },
        // shadowOpacity: 100,
        // shadowRadius: 3,
      },
      backButtonText:{
        color: 'black',
        // color:'#000',
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
        opacity: 0.9,
      },
      cardText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 130,
        marginLeft: 10,
        zIndex: 10,
        borderColor: 'black',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
      }

    });
