import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import LocationSuggestion from './LocationSuggestion';
import {Text, Image, Button} from 'react-native';

class LocationList extends React.Component {  
    render() {
        return (
            <ScrollView style={{padding: 10}}>
            {this.props.results.map((suggestions, index) => {
                   return <LocationSuggestion key={index} name={suggestions.name} rating={suggestions.rating}
                        image_url={suggestions.image_url} categories={suggestions.categories} price={suggestions.price}
                        display_address={suggestions.location.display_address[0]} suggestion_json={JSON.stringify(suggestions)}
                        addStop={this.props.addStop}
                   />
                })}
            </ScrollView>
        )
    }
}
const styles = StyleSheet.create({
  locationList: {
  }
});
export default LocationList