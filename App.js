import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
//import Constants from 'expo-constants';
import 'react-native-gesture-handler';
import DashboardScreen from './Components/DashboardScreen';
import SaiScreen from './Components/SaiScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Request Notification Permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    };

    const setupNotificationChannels = async () => {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    };

    requestPermissions();
    setupNotificationChannels();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('\nNotification response:', response);
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);


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


