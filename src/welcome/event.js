import React, { Component } from 'react'
import {  View, Text, ImageBackground, TouchableOpacity} from 'react-native'
import {  H1, Label, Icon, Form, Input, Item, Content} from 'native-base' 
import styles from './style' 
 
export default class WelcomeEvent extends Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
      <ImageBackground style={styles.backgroundContainer} source={require('../../images/concert.jpg')}>
          <Content style={styles.container}>
              <H1 style={styles.welcome}>Event</H1>
              <Text style={styles.sologanText} >
              Events are like Albums. Pictures are stored and shared in events. You can also see pictures of popular events close to you
              </Text>

            <TouchableOpacity style={styles.buttonContainer} 
                  onPress={() =>navigate('WelcomeJoinEvents')}
                  //onPress={this.onLoginPress}
                  >
                <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </Content>
      </ImageBackground>    
    )
  }
}
