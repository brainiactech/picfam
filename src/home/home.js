import React, { Component } from "react";
import { Container, Fab, Icon } from "native-base";

import HomeHeader from "./header";
import HomeFooter from "./footer";
import HomeBody from "./body";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log("homejs");
    const { navigate } = this.props.navigation;

    const authLayout = (
      <Container>
        <HomeHeader theNav={navigate} />
        <HomeBody theNav={navigate} />
        <Fab
          style={{ backgroundColor: "#FF6600", marginBottom: 40 }}
          position="bottomRight"
          onPress={() => navigate("AddPictureByEventList")}
        >
          <Icon name="camera" />
        </Fab>
        <HomeFooter theNav={navigate} />
      </Container>
    );
    //const theLayout = this.state.token ? authLayout : notAuthLayout;
    return authLayout;
  }
}
