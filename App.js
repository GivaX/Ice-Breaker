import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import 'react-native-gesture-handler';
import DashboardScreen from './Ice-Breaker-main/Components/DashboardScreen';
import ValveTrends from './Ice-Breaker-main/Components/ValveTrends';
import Schedules from './Ice-Breaker-main/Components/Schedules';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Dashboard'>
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ 
            title: 'dashboard', 
            headerTitleAlign: 'center',
            headerTintColor: '#fff',
            headerStyle: {
              elevation: 0,  
              shadowOpacity: 0,
              backgroundColor: '#293741' 
            }
          }}
        />
        <Stack.Screen
          name='ValveTrends'
          component={ValveTrends} 
          options={{ 
            title: 'valve',
            headerTitleAlign: 'center',
            headerStyle: {
              elevation: 0,  
              shadowOpacity: 0,
              backgroundColor: '#293741' 
            } 
          }}
        />
        <Stack.Screen
          name='Schedules'
          component={Schedules} 
          options={{ 
            title: 'schedule',
            headerTitleAlign: 'center',
            headerStyle: {
              elevation: 0,  
              shadowOpacity: 0,
              backgroundColor: '#293741' 
            } 
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


