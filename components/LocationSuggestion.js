import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

class LocationSuggestion extends React.Component {  
    render() {
        return (
            <View className="location-suggestion">
                <View className="location-name"><Text>{this.props.name}</Text></View>
                <View className="location-rating"><Text>{this.props.rating}</Text></View>
            </View>
        )
    }
}

export default LocationSuggestion