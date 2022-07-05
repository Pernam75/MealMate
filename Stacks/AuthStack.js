import React from 'react';
import Signin from '../components/Signin';
import Signup from '../components/Signup';
import Boarding1 from '../components/Boarding1';
import Boarding2 from '../components/Boarding2';
import Boarding3 from '../components/Boarding3';
import Boarding4 from '../components/Boarding4';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack = createNativeStackNavigator();

export default function Profile() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Boarding1" component={Boarding1} />
      <Stack.Screen name="Boarding2" component={Boarding2} />
      <Stack.Screen name="Boarding3" component={Boarding3} />
      <Stack.Screen name="Boarding4" component={Boarding4} />
      <Stack.Screen name="Signin" component={Signin} />
      <Stack.Screen name="Signup" component={Signup} />
    </Stack.Navigator>
  );
}