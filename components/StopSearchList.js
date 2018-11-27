import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {TextInput, TouchableOpacity, Text, Image, Button} from 'react-native';

class StopSearchList extends React.Component {
    render() {
        return (
            this.props.stops.map((val, index) => {
                return (
                  <View style={styles.row} key={index}>
                      <TextInput
                        style={styles.searchInput}
                        value={this.props.searchString[index]}
                        onSubmitEditing={() => this.props.submitFunc(index)}
                        onChange={(e) => this.props.changeFunc(index, e)}
                        placeholder='Add a Stop'/>
                      <TouchableOpacity
                        style={styles.removeStopButton}
                        onPress={() => this.props.removeFunc(index)}>
                        <Text style={styles.removeStopButtonText}>×</Text>
                      </TouchableOpacity>
                  </View>
                )
            })
        )
    }
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  searchInput: {
    marginLeft: 20,
    padding: 15,
    fontSize: 17,
    borderBottomColor: '#9B9B9B',
    borderBottomWidth: 0.5,
    textAlign: 'left',
    flex: 4
  },
  removeStopButton: {
    marginTop: 10,
    marginLeft: 15,
    marginRight: 5,
  },
  removeStopButtonText: {
    textAlign:'center',
    color: 'black',
    fontSize: 25
  }
});
export default StopSearchList
