import React, { Component } from 'react';
import { Footer, FooterTab, Button, Text, Icon, StyleProvider } from 'native-base'; 
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import OneSignal from 'react-native-onesignal';
import {ONESIGNAL_APPID} from '../../config/constants'

export default class HomeFooter extends Component {

    componentWillMount() { 
        OneSignal.init(ONESIGNAL_APPID); 
        OneSignal.addEventListener('opened', this.onOpened.bind(this));
        OneSignal.configure(); 
    }

    componentWillUnmount() {
        OneSignal.removeEventListener('opened',  this.onOpened.bind(this));
    }

    onOpened() {
        this.props.theNav('Notification')
    }
    onReceived() {
        this.props.theNav('Notification')
    }
  
  render() {
    return (
        <StyleProvider style={getTheme(material)}>
            <Footer> 
                <FooterTab> 
                    <Button vertical>
                        <Icon name="md-bulb" onPress={() => this.props.theNav('Browse')} />
                        <Text onPress={() => this.props.theNav('Browse')}>Browse</Text>
                    </Button>
                    <Button vertical onPress={() => this.props.theNav('ListGroup') }>
                        <Icon name="people" />
                        <Text onPress={() => this.props.theNav('ListGroup') }>Group</Text>
                    </Button>
                    <Button vertical active onPress={() => this.props.theNav('ListEvent')}>
                        <Icon active name="happy" />
                        <Text onPress={() => this.props.theNav('ListEvent')}>Event</Text>
                    </Button>
                    {/* <Button badge onPress={() => this.props.theNav('Notification') }>
                        <Badge><Text>2</Text></Badge>
                        <Icon name="notifications" />
                        <Text>Alert</Text>
                    </Button> */}
                    <Button vertical onPress={() => this.props.theNav('Profile')}>
                        <Icon name="person" />
                        <Text onPress={() => this.props.theNav('Profile')}>Profile</Text>
                    </Button>
                </FooterTab> 
            </Footer> 
        </StyleProvider>
    )
  }
}
