import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import React, { Component } from 'react';
import Start from './components/Start';
import Chat from './components/Chat';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default class HelloWorld extends Component {

  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='Start'
        >
          <Stack.Screen
            name='Start'
            component={Start}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='Chat'
            component={Chat}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}


