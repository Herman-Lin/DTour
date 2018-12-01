import React from 'react';
import {View, Text, Image, Button, StyleSheet, TouchableOpacity} from 'react-native';

class AddDeleteStopButton extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            addDisabled: false,
            deleteDisabled: true,
        }
    }
    render() {
        let addStop = this.props.addStop;
        let removeStop =this.props.deleteStop;
        let resultJson = this.props.suggestion_json;

        if(this.state.deleteDisabled){
        return (
            <View>
            <TouchableOpacity style={styles.addStopButton}
                onPress={() => {addStop(resultJson); this.setState({addDisabled: true, deleteDisabled: false})}}>
              <Text style={styles.addStopButtonText}>Add</Text>
            </TouchableOpacity>
            </View>
        )
        }
        else{
        return (
            <View>
            <TouchableOpacity style={styles.removeStopButton}
                onPress={()=>{removeStop(resultJson);
                            this.setState({deleteDisabled: true, addDisabled: false})}}>
              <Text style={styles.addStopButtonText}>Delete</Text>
            </TouchableOpacity>
            </View>
        )
        }
    }
}
const styles = StyleSheet.create({
  addStopButton: {
    backgroundColor: '#61B329',
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
  },
  removeStopButton: {
      backgroundColor: '#FF5E5E',
      paddingTop: 5,
      paddingBottom: 5,
      borderRadius: 5,
    },
  addStopButtonText: {
    textAlign:'center',
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  }
});
export default AddDeleteStopButton
