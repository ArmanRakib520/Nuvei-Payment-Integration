import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/home/HomeScreen';
import PaymentScreen from '../screens/payment/PaymentScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4a90e2',
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Mporeo Payment' }}
        />
        <Stack.Screen 
          name="Payment" 
          component={PaymentScreen} 
          options={{ title: 'Payment' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;


