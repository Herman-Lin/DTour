import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import LocationSuggestion from './LocationSuggestion';
import {Text, Image, Button, TouchableOpacity} from 'react-native';

class LocationList extends React.Component {  
    render() {

        if(this.props.currentSearch === -1){
            let toCoord =this.props.toCoord;
            return (
                <ScrollView style={{padding: 10}}>
                    {this.props.addressSuggestions.map((suggestion, index) => {
                       var suggestion_json = JSON.stringify(suggestion);
                       return <View style={styles.resultRow} key={index}>
                            <Text style={{padding: 4, textAlign: "left"}} onPress={()=>toCoord(suggestion_json)}>{suggestion.Address}</Text>
                        </View>
                    })}
                </ScrollView>
            )
        }
        else if(this.props.currentSearch >= 0 && this.props.currentSearch !== null){
            return (
                <View >
                <TouchableOpacity onPress={() => this.props.clickDone()}
                    style={styles.doneButton}
                    underlayColor='#fff'>
                    <Text style={styles.generateButtonText}>Done</Text>
                </TouchableOpacity>
                <ScrollView style={{padding: 10}}>

                {this.props.results.map((suggestion, index) => {
                    return <LocationSuggestion key={index} name={suggestion.name} rating={suggestion.rating}
                        image_url={suggestion.image_url} categories={suggestion.categories} price={suggestion.price}
                        display_address={suggestion.location.display_address[0]} suggestion_json={JSON.stringify(suggestion)}
                        addStop={this.props.addStop} deleteStop={this.props.deleteStop}
                    />
                    })}
                </ScrollView>
                </View>
            )
        }
        else{
            return(
            <ScrollView style={{padding: 10}}>
            {this.props.results.map((suggestion, index) => {
                return <LocationSuggestion key={index} name={suggestion.name} rating={suggestion.rating}
                    image_url={suggestion.image_url} categories={suggestion.categories} price={suggestion.price}
                    display_address={suggestion.location.display_address[0]} suggestion_json={JSON.stringify(suggestion)}
                    addStop={this.props.addDest}
                />
                })}
            </ScrollView>
            )
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
  doneButton:{
    marginLeft: '75%',
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor:'#FF5E5E',
    borderRadius: 15,
    position: 'absolute',
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 3,
  },
  generateButtonText:{
      color:'#fff',
      fontSize: 17,
      fontWeight: 'bold',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10,
  },
});
export default LocationList