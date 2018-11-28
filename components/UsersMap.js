import React, { Component } from 'react';
import {View, StyleSheet} from 'react-native';
import MapView, { Polyline } from 'react-native-maps';



//Component used to show map
mapStyle = [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ]


const usersMap = props => {
    let userLocationMarker = null;
    let userDestinationMarker  = null;
    let routePolyline = null;
    let wayPointMarkers = null;
    let displayRoute = 0;
  

    this.state = {
        markers : props.wayPoints,
        coords: props.coordinates,
        destinationLatLong: null,
        displayRoute: 0,
    };

    if (props.userLocation) {
        userLocationMarker = <MapView.Marker coordinate={props.userLocation} pinColor="gold" />
    }

    if (props.destinationLocation) {
        userDestinationMarker = <MapView.Marker coordinate={props.destinationLocation} />;
       
    }

    if (props.displayRoute == 1) {   //display route only once trip has been planned. Initially app has no route displayed.
        displayRoute = 1;
        routePolyline = <Polyline coordinates={this.state.coords} strokeColor="#FF5E5E" strokeWidth={4} />
    }

    if (props.wayPoints) {
      

      //allows for rendering of multiple markers
      wayPointMarkers = this.state.markers.map(marker => (
        <MapView.Marker 
          coordinate={marker}
          
        />
      ))
        
        //wayPointMarkers = <MapView.Marker coordinate={this.state.markers} pinColor="red" />
    }

   
   
    console.log(props.coordinates)
    //this.setState({
     //   coords: props.coordinates
    //});

  

    
   //{this.state.markers.map(marker =>(
    //<MapView.Marker coordinate={{longitude: marker.longitude, latitude: marker.latitude}} />
    //))}
    return (
        <View style={styles.mapContainer}>
            <MapView 
                initialRegion = {{
                    latitude: 37.78825,
                    longitude: -122.4324,
                    latitudeDelta: 0.0622,
                    longitudeDelta: 0.0421,
                  }}
                region={props.userLocation}
                
                style={styles.map}
                customMapStyle={mapStyle}
                > 
                
                
             
                
               {routePolyline}
                
                {wayPointMarkers}
                {userLocationMarker}
                {userDestinationMarker}

            </MapView>
        </View>
    );
;}

const styles = StyleSheet.create({
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: 800,
        justifyContent: 'center',
        alignItems: 'center',
        
    },
    map: {
        width: '100%',
        height: '100%',
    },
    marker: {
        color: '#FF7F50',
    }
});

export default usersMap;