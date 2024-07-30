// navigation/HomeStack.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SignUp from '../components/SignUp';
import LoginScreen from '../components/login';
import PumpControlScreen from '../components/PumpControlScreen';
import { StyleSheet } from 'react-native';
import PlanningScreen from '../components/Plannification';
import Historique from '../components/Historique';

const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen name="Home" component={SignUp} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="PumpControlScreen" component={PumpControlScreen} />
      <Stack.Screen name="Planning" component={PlanningScreen} />
      <Stack.Screen name="His" component={Historique} />
    </Stack.Navigator>
  );
};

export default HomeStack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', 
  },
});
