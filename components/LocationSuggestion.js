import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

class LocationSuggestion extends React.Component {  
    render() {
        return (
            <View style={styles.resultRow}>
                <Image source={{uri: this.props.image_url}}
                    style={{width: 80, height: 80, margin: 10, justifyContent:'flex-start'}}/>
                <View style={{flexDirection: 'column', justifyContent: 'center'}}>
                    <Text style={{fontWeight: 'bold'}}>{this.props.name}</Text>
                    <Text>{this.props.rating}</Text>
                    <Text>{this.props.categories[0].title}</Text>
                    <Text>{this.props.price}</Text>
                    <Text>{this.props.display_address}</Text>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingTop: 10,
    paddingBottom: 5,
    width: 325,
    height: 120,
    borderTopWidth: 1,
    borderColor: '#555555',
  }

});
export default LocationSuggestion