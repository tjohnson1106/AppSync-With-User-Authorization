import React, { Component } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { TabNavigator, SwitchNavigator } from "react-navigation";
import { ApolloProvider as Provider } from "react-apollo";

import Amplify from "aws-amplify";
import config from "./aws-exports";
import AppSync from "./AppSync";
import Client from "aws-appsync";
import { Rehydrated } from "aws-appsync-react";
import { Auth } from "aws-amplify";

import SignIn from "./src/SignIn";
import SignUp from "./src/SignUp";
import Cities from "./src/Cities";
import AddCity from "./src/AddCity";
import Profile from "./src/Profile";

Amplify.configure(config);

// const client = new Client({
//   url: AppSync.graphqlEndpoint,
//   region: AppSync.region,
//   auth: {
//     type: AppSync.authenticationType,
//     apiKey: AppSync.apiKey
//   }
// });

const client = new Client({
  url: AppSync.graphqlEndpoint,
  region: AppSync.region,
  auth: {
    type: "AMAZON_COGNITO_USER_POOLS",
    jwtToken: async () => (await Auth.currentSession()).getIdToken().getJwtToken()
  }
});

const Tabs = TabNavigator({
  SignIn: { screen: SignIn },
  SignUp: { screen: SignUp }
});

const AppNav = TabNavigator({
  Cities: { screen: Cities },
  AddCity: { screen: AddCity },
  Profile: { screen: Profile }
});

const SwitchNav = SwitchNavigator(
  {
    Tabs,
    AppNav
  },
  {
    initialRoute: Tabs
  }
);

export default class App extends Component {
  render() {
    return (
      <Provider client={client}>
        <Rehydrated>
          <SwitchNav />
        </Rehydrated>
      </Provider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5
  }
});
