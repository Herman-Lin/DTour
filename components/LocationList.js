import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import LocationSuggestion from './LocationSuggestion';
import {Text, Image, Button, TouchableOpacity} from 'react-native';

class LocationList extends React.Component {
    render() {
        if(this.props.currentSearch >= -2){
            return (
                <View>
                  <ScrollView style={{padding: 10}}>
                    {this.props.results.map((suggestion, index) => {
                        return <LocationSuggestion key={index} name={suggestion.name} rating={suggestion.rating}
                            image_url={suggestion.image_url} categories={suggestion.categories} price={suggestion.price}
                            display_address={suggestion.location.display_address[0]} suggestion_json={JSON.stringify(suggestion)}
                            addStop={(this.props.currentSearch >= 0) ? this.props.addStop : (this.props.currentSearch === -2) ? this.props.addDest : this.props.addStart} deleteStop={this.props.deleteStop}
                        />
                    })}
                  </ScrollView>
                </View>
            )
        }
        else{
            return null;
        }

    }
}
const styles = StyleSheet.create({
 resultRow: {
    flexDirection: 'row',
    width: 325,
    paddingTop: 5,
    paddingBottom: 2,
    borderTopWidth: 1,
    borderColor: '#555555',
  },
  // doneButton:{
  //   marginTop: 300,
  //   marginLeft: '32%',
  //   backgroundColor:'#FF5E5E',
  //   borderRadius: 15,
  //   position: 'absolute',
  //   shadowOffset: { width: 2, height: 5 },
  //   shadowOpacity: 0.5,
  //   shadowRadius: 3,
  //   // marginLeft: '75%',
  //   // paddingTop: 10,
  //   // paddingBottom: 10,
  //   // backgroundColor:'#FF5E5E',
  //   // borderRadius: 5,
  //   // position: 'absolute',
  //   // shadowOffset: { width: 2, height: 5 },
  //   // shadowOpacity: 0.5,
  //   // shadowRadius: 3,
  //   elevation: 3,
  //   zIndex: 1,
  // },
  // generateButtonText:{
  //     color:'#fff',
  //     fontSize: 17,
  //     fontWeight: 'bold',
  //     textAlign:'center',
  //     paddingLeft : 10,
  //     paddingRight : 10,
  //     paddingTop: 15,
  //     paddingBottom: 15,
  // },
});
export default LocationList
