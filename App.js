import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import DashboardScreen from './Components/DashboardScreen';
import SaiScreen from './Components/SaiScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Dashboard'>
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Hydrate Detection Dashboard' }}
        />
        <Stack.Screen
          name='SaiScreen'
          component={SaiScreen} 
          options={{ title: 'Sai' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


