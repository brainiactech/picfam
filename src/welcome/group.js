import React, { Component } from 'react'
import {  View, Text, ImageBackground, TouchableOpacity} from 'react-native'
import {  H1, Label, Icon, Form, Input, Item, Content} from 'native-base' 
import styles from './style' 


export default class WelcomeGroup extends Component {
  render() {
    const { navigate } = this.props.navigation;
    return (
        <ImageBackground style={styles.backgroundContainer} source={require('../../images/group.jpg')}>
          <Content style={styles.container}>
              <H1 style={styles.welcome}>Group</H1>
              <Text style={styles.sologanText} >
              Arrange similar events into Group. 'Default' group could contain event like 'My Birthday'. 
              </Text>

            <TouchableOpacity style={styles.buttonContainer} 
                  onPress={() =>navigate('WelcomeEvent')}>
                <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </Content>
      </ImageBackground>    
    )
  }
}
