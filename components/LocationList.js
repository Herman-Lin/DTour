import React from 'react';
import {View} from 'react-native';
import LocationSuggestion from './LocationSuggestion';

class LocationList extends React.Component {  
    render() {
        return (
            <View style={{padding: 10}}>
            {this.props.results.map((suggestions, index) => {
                   return <LocationSuggestion key={index} name={suggestions.name} rating={suggestions.rating}
                        image_url={suggestions.image_url} categories={suggestions.categories} price={suggestions.price}
                        display_address={suggestions.location.display_address[0]}
                   />

                })}
            </View>
        )
    }
}
export default LocationList