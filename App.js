import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

import {AddToChatScreen, HomeScreen, LoginScreen, RegistrationScreen, SplashScreen, Test} from "./screens";
import { Provider } from "react-redux";
import Store from "./context/store";

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Provider store={Store}>
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splash" component={SplashScreen}></Stack.Screen>
          <Stack.Screen name="Login" component={LoginScreen}></Stack.Screen>
          <Stack.Screen name="Register" component={RegistrationScreen}></Stack.Screen>
          <Stack.Screen name="Home" component={Test}></Stack.Screen>
          <Stack.Screen name="AddToChat" component={AddToChatScreen}></Stack.Screen>
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
