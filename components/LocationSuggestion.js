import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

class LocationSuggestion extends React.Component {  
    render() {
        return (
            <View>
                <Image source={{uri: this.props.image_url}}
                    style={{width: 80, height: 80, justifyContent:'flex-start'}}/>
                <Text>{this.props.name}</Text>
                <Text>{this.props.rating}</Text>
                <Text>{this.props.categories[0].title}</Text>
                <Text>{this.props.price}</Text>
                <Text>{this.props.display_address}</Text>
            </View>
        )
    }
}
const styles = StyleSheet.create({

});
export default LocationSuggestion