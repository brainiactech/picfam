import React, { Component } from "react";
import {Text, View, TouchableOpacity, ImageBackground, AsyncStorage} from "react-native";
import styles from "./style";
import OneSignal from 'react-native-onesignal';
import {ONESIGNAL_APPID} from '../../config/constants';
import Loading from '../components/Loading';
export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: false,
      checkingtoken: false,oneSignalPlayerId:null,
    };

    console.disableYellowBox = true;
  }

  static navigationOptions = {
    title: "Welcome"
  };

  async componentWillMount() {
    OneSignal.init(ONESIGNAL_APPID); 
    OneSignal.addEventListener('ids',this.onIds);
    OneSignal.configure(); 
    try {
      console.log("componentWillMount : ...");
      await AsyncStorage.setItem("teststuff1", "testvalue1");
      const token = await AsyncStorage.getItem("@pixfam_token");
      token ? this.setState({ token: true }) : this.setState({ token: false });
      console.log("token in componentWillMount: ", this.state.token);
      this.state.token && this.props.navigation.navigate("Home");
    } catch (error) {
      console.log("error: " + error.message);
    }
  }
  componentDidMount() {
    this.state.token && this.props.navigation.navigate("Home");
  }
  componentWillUnmount() {
    OneSignal.removeEventListener('ids',this.onIds);
  }
  onIds =  async (device) =>{
    this.setState({oneSignalPlayerId: device.userId});
    // console.log(this.state.oneSignalPlayerId)
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <ImageBackground
        style={styles.backgroundContainer}
        source={require("../../images/plain_bk.png")}
      >
        <View style={styles.container}>
          <Text style={styles.name}>Pixfam </Text>
          <Text style={styles.solgan}>Event pictures sharing app</Text>

          {this.state.oneSignalPlayerId != null
            ? <TouchableOpacity style={styles.buttonContainer} onPress={() => navigate("Signup")}>
                <Text style={styles.buttonText}>GET STARTED</Text>
             </TouchableOpacity>
            :<Loading/>
          }
         
        </View>
      </ImageBackground>
    );
  }
}
