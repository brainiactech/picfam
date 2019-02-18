import React, { Component } from 'react'
import { StyleSheet, Text, TextInput, View, Image, ImageBackground,} from 'react-native';
import { KeyboardAvoidingView, Keyboard, TouchableOpacity , StatusBar, AsyncStorage} from 'react-native';
import {H3, Toast} from 'native-base';
import { graphql, compose } from 'react-apollo';

import styles from './style' 
import SIGNUP_MUTATION from '../../graph/mutations/signupMutation';
import Loading from '../../components/Loading';
import {UppperCaseFirst} from '../../../config/functions'; 
import OneSignal from 'react-native-onesignal';
import {ONESIGNAL_APPID} from '../../../config/constants';

class SignupScreen extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: "", email: "", password: "", imagePath:"", loading: false, signedup: false,
      oneSignalPlayerId: "",
      errorMessage: false,
      showToast: false
    }
  }

  componentWillMount() { 
    OneSignal.init(ONESIGNAL_APPID); 
    OneSignal.addEventListener('ids', this.onIds);
    OneSignal.configure(); 
  }

  componentWillUnmount() {
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onIds =  async (device) =>{
      this.setState({oneSignalPlayerId: device.userId});
      // console.log(this.state.oneSignalPlayerId)

  }

  onInputTextChange = (text, type) => {
    this.setState({ [type]: text });
  } 

  onSignupPress = async () => {
    Keyboard.dismiss()
    this.setState({ loading: true });
    this.state.imagePath = "https://magbodo.com/asset/pixfam-images/profile.jpg";
    this.state.username = UppperCaseFirst(this.state.username);
    const { username, email, password, imagePath, oneSignalPlayerId } = this.state;

    try {
      const {data} = await this.props.mutate({
        variables: {username, email, password, imagePath, oneSignalPlayerId}
      });
    
      this.setState({ loading: false });
      this.setState({signedup: true});
      this.props.navigation.navigate('Welcome');
              
      try{
        await AsyncStorage.setItem('@pixfam_token', data.signup.token);
        await AsyncStorage.setItem('@pixfam_email', email); //used by event member
      }
      catch(error){
       // console.log('error in setItem');
        throw error;
      }

    } catch (error) {
      //console.log('error in onsignup: ',error);
      this.setState({ loading: false });
      this.setState({errorMessage: error.message});
      Toast.show({
        text: error.message,
        buttonText: 'Okay',
        type: "danger",
        duration: 4000
      });
      throw error;
    }
};
  render() {
    const { navigate } = this.props.navigation;
    return (
        
          <KeyboardAvoidingView behavior="padding" style={styles.container}>
            <ImageBackground style={styles.backgroundContainer} 
                  source={require('../../../images/signup_bk.png')}>

              <View style={styles.container}>
                  <View style={styles.sologanText}>
                    <H3 style={styles.title}>Capture Every Moment</H3>
                    {/* <Text style={styles.title}>{this.state.errorMessage}</Text> */}
                  </View>
                  {this.state.loading && <Loading />}
                  
                  <View style={styles.formContainer}>
                    <TextInput style={styles.input}
                        placeholder="Username"
                        returnKeyType="next"
                        onSubmitEditing ={() => this.passwordEmail.focus()}
                        autoCorrect ={false}
                        autoCapitalize="none"
                        placeholderTextColor='#2980b9'
                      onChangeText={text => this.onInputTextChange(text, 'username')}
                        />

                      <TextInput style={styles.input}
                        placeholder="Email"
                        returnKeyType="next"
                        onSubmitEditing ={() => this.passwordInput.focus()}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect ={false}
                        ref={(input) => this.passwordEmail = input}
                        placeholderTextColor='#2980b9'
                        onChangeText={text => this.onInputTextChange(text, 'email')}
                        />

                    <TextInput style={styles.input}
                        placeholder="Password"
                        returnKeyType="go"
                        placeholderTextColor='#2980b9'
                        autoCapitalize="none"
                        ref={(input) => this.passwordInput = input}
                        secureTextEntry
                        onChangeText={text => this.onInputTextChange(text, 'password')}
                        />

                    <TouchableOpacity onPress={this.onSignupPress} style={styles.buttonContainer} 
                      disabled={this.state.signedup}>
                        <Text style={styles.buttonText}> {this.state.signedup ? ' Thanks ' : 'SIGN UP'}</Text>
                    </TouchableOpacity>

                    <View style={styles.loginTextContain} >
                      <Text onPress={() =>navigate('Login')}>Do you have an account?</Text>
                      <Text onPress={() =>navigate('Login')} style={styles.loginText}> Log in</Text>     
                    </View>       
                </View>
              </View>

          </ImageBackground >
      </KeyboardAvoidingView>
  
    );
  }
}

export default graphql(SIGNUP_MUTATION) ( SignupScreen);

