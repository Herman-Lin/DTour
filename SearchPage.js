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

export default class SearchPage extends Component{
    constructor(props) {
      super(props);
      this.state = {
        searchString: 'ramen',
        isLoading: false,
        textValue: 'JSON response will be shown'
      };
    }

    places_search = (search_str, latitude, longitude) => {
       const Http = new XMLHttpRequest();
       url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" + String(latitude) + "," + String(longitude) + "&radius=40000" + "&keyword=" + encodeURIComponent(search_str) + "&key=AIzaSyAwnXWH-qrRpBWraATnVVyHxKYuRSZEQ8M";
       Http.open("GET", url);
       Http.send();
       Http.onreadystatechange = e => {
         if (Http.readyState == 4 && Http.status == 200) {
           let response = JSON.parse(Http.responseText);
           var result = [];
           for (var i = 0; i < response["results"].length; i++) {
             result_json = { name: response["results"][i]["name"], ratings: response["results"][i]["ratings"], types: response["results"][i]["types"], location: response["results"][i]["geometry"]["location"] };
             result.push(result_json);
           }
           console.debug(result);
           this.setState({
             textValue: JSON.stringify(result)
           });
         }
       };
     };

    route_search = (mode, start_latitude, start_longitude, end_latitude, end_longitude) => {
      const Http = new XMLHttpRequest();
      var url = "https://maps.googleapis.com/maps/api/directions/json?origin=" + String(start_latitude) + "," + String(start_longitude) + "&destination=" + String(end_latitude) + "," + String(end_longitude) + "&key=AIzaSyDH6H2IlW_LHCmfh0CV0-aS9aR19XMsn94";
      Http.open("GET", url);
      Http.send();
      Http.onreadystatechange = e => {
        if (Http.readyState == 4 && Http.status == 200) {
          let response = JSON.parse(Http.responseText);
          let result = {
            "time": response['routes'][0]['legs'][0]['duration']['value'],
            "distance": response['routes'][0]['legs'][0]['distance']['value'],
            "polyline": response['routes'][0]['overview_polyline']['points']
          };
          console.log(result);
          this.setState({
            textValue: JSON.stringify(result)
          });
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

          var result = []
          for (var i = 0; i < response['businesses'].length; i++) {
            var result_json = {
              "name": response['businesses'][i]['name'],
              "image_url": response['businesses'][i]['image_url'],
              "is_closed": response['businesses'][i]['is_closed'],
              "review_count": response['businesses'][i]['review_count'],
              "categories": response['businesses'][i]['categories'],
              "rating": response['businesses'][i]['rating'],
              "coordinates": response['businesses'][i]['coordinates'],
              "price": response['businesses'][i]['price'],
              "location": response['businesses'][i]['location'],
            }
            result.push(result_json)
          }
          console.log(result);
          this.setState({
            isLoading: false,
            textValue: JSON.stringify(result)
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
      this.yelp_search(this.state.searchString, +34.06893, -118.445127);
      this.setState({ isLoading: true });
    };


    static navigationOptions ={
        title: 'Dtour',
    };

    render(){
        const spinner = this.state.isLoading ? <ActivityIndicator size='large'/> : null;
        //console.log('SearchPage.render');
        return (
            <View style={styles.container}>
                <Text style={styles.description}>
                    Search for destinations!
                </Text>
                <View style={styles.flowRight}>
                  <TextInput
                    style={styles.searchInput}
                    value={this.state.searchString}
                    onChange={this._onSearchTextChanged}
                    placeholder='Search'/>
                  <Button
                    onPress={this._onSearchPressed}
                    color='#FF0800'
                    title='Go'
                  />
                  {spinner}
                </View>
                <Text style={{ color: "red" }}>{this.state.textValue}</Text>
             </View>
        );
    }


}
const styles = StyleSheet.create({
      description: {
        marginBottom: 20,
        fontSize: 18,
        textAlign: 'center',
        color: '#656565'
      },
      container: {
        padding: 30,
        marginTop: 65,
        alignItems: 'center'
      },
      flowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
      },
      searchInput: {
        height: 36,
        padding: 4,
        marginRight: 5,
        flexGrow: 1,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#FF0800',
        borderRadius: 8,
        color: '#FF0800',
      },

    });