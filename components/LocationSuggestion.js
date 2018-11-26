import React from 'react';
import {View, Text, Image, Button, StyleSheet} from 'react-native';

class LocationSuggestion extends React.Component {  
    render() {
        let addStop = this.props.addStop;
        let resultJson = this.props.suggestion_json;
        return (
            <View style={styles.resultRow}>
                <Image source={{uri: this.props.image_url}}
                    style={{width: 80, height: 80, margin: 10, justifyContent:'flex-start'}}/>
                <View style={{flexDirection: 'column', justifyContent: 'center', width: 150}}>
                    <Text style={{fontWeight: 'bold'}}>{this.props.name}</Text>
                    <Text>{this.props.rating} | {this.props.price}</Text>
                    <Text>{this.props.categories[0].title}</Text>
                    <Text>{this.props.display_address}</Text>
                </View>
                <View style={{flexDirection: 'column', width: 50, marginTop: 30, marginRight: 5}}>
                    <Button onPress={()=>addStop(resultJson)} title="Add"/>
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