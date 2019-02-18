import React, { Component } from "react";
import { ApolloProvider } from "react-apollo";
import PixNavigation from "./PixNavigation";
import { client } from "./src/graph/client";
import { Root } from "native-base";

Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
  obj.__proto__ = proto
  return obj
}
export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <Root>
          <PixNavigation />
        </Root>
      </ApolloProvider>
    );
  }
}
