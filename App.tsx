import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';

import { RootStackParamList } from './src/types/navigation';

// Screens
import MenuScreen from './src/screens/Menu';
import DetailsScreen from './src/screens/Details';

// Initializations
const apolloClient = new ApolloClient({
  uri: 'https://dex-server.herokuapp.com/',
  cache: new InMemoryCache(),
});
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContainer = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="menu" component={MenuScreen} />
      <Stack.Screen name="details" component={DetailsScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default () => {
  useEffect(() => {
    SplashScreen.hide();
  });

  return (
    <ApolloProvider
      client={apolloClient}
    >
      <AppContainer />
    </ApolloProvider>
  );
};
