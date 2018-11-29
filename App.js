import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, Button } from 'react-native';
import{ createStackNavigator } from 'react-navigation';
import SearchPage from './SearchPage';
import AddStopPage from './AddStopPage';
import RouteMapPage from './RouteMapPage';
import FetchLocation from './components/FetchLocation';

const App = createStackNavigator(
  {
    Home: {
      screen: SearchPage,
      navigationOptions: () => ({
        header: null
      }),
    },
    AddStop: {
      screen: AddStopPage,
      navigationOptions: () => ({
        title: `Route Planning`,
      })
    },
    RouteMap: {
      screen: RouteMapPage,
      navigationOptions: () => ({
        header:null
      })
    }

  },
  {
    initialRouteName: 'Home'
  }
);

export default App;

const styles = StyleSheet.create({
  description: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555555',
    marginTop: 65,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
