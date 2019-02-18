import React, { Component } from 'react'
import { Container, Content, List, Thumbnail, ListItem, Text, View, H3, Left, Body, Toast} from 'native-base';
import { TouchableOpacity } from 'react-native';

import styles from './style'; 
import globalColor from '../../config/app-colors'; 
import { Query } from "react-apollo";
import { GET_RANDOM_EVENTS} from '../graph/queries/randomEventQueries';
import { SEND_JOIN_EVENT_REQUEST } from '../graph/mutations/sendJoinEventRequestMutation';
import { ApolloConsumer } from 'react-apollo';

export default class WelcomeJoinEvents extends Component {
    constructor(props){
        super(props);
        this.state = { 
           showToast: false,
           event:null, receiverUser:null, status:"Pending",requestType:"Join",
           requestSent:"Join"
        };
    }

    async doSendJoinEventRequest(client,event, receiverUser) {

        this.setState({ requestSent:"Pending" }); 
        const {status, requestType } = this.state;
        client.mutate({
            variables: {receiverUser, event, status,requestType},
            mutation: SEND_JOIN_EVENT_REQUEST
            })
          .then(data => { 
               
              if(data.data.sendJoinEventRequest.status == "Pending"){
                  Toast.show({
                      text: "Your request was sent",
                      type: "success",
                      duration: 4000
                      });
              }else{
                  Toast.show({
                      text: "You have already requested an invite",
                      type: "warning",
                      duration: 4000
                      });
              } }
            )
          .catch(error => { console.log(error)
            if(error){
                Toast.show({
                    text: error.message,
                    buttonText: 'Okay',
                    type: "danger",
                    duration: 4000
                  });
                  throw error;
            } }); 
    }
  
  render() {
    const { navigate } = this.props.navigation;
    return (

        <Query query={GET_RANDOM_EVENTS}>
            {({ loading, error, data }) => 
            { 
                var theList = null;
                if (loading) return <Text> Loading...</Text>;
                if (error){
                    Toast.show({
                        text: error.message,
                        buttonText: 'Okay',
                        type: "danger",
                        duration: 4000
                        });
                        return <Text> Whoops! Something got broken</Text>;
                }
                if(data){ 
                    theList = (
                        <List dataArray={data.getRandomEvents}
                        renderRow={(randomEvent) =>
                         <ListItem avatar>
                            <Left>
                                 <Thumbnail small source={{ uri: randomEvent.group.user.image_path}}/>
                            </Left>    
                            <Body>
                                <Text >{randomEvent.title}</Text>
                                <Text note >{randomEvent.description}</Text>
                            </Body>
                            <ApolloConsumer>
                                {client => (
                                     <Text note 
                                      onPress={this.doSendJoinEventRequest.bind(this, 
                                                client,randomEvent._id, randomEvent.group.user._id )}
                                     style={globalColor.appDarkPrimaryColor} >{this.state.requestSent}</Text>
                                )}
                            </ApolloConsumer>
                        </ListItem>
                        }>
                    </List>)
              
                }

                return(   
                    <Container style={styles.container}>
                        <Content>
                            <View > 
                                <H3>Join Public Events</H3>                                
                            </View>  
                            {theList}
                        </Content>
                        <TouchableOpacity style={styles.buttonContainer}
                                      onPress={() => navigate('Home')} >
                            <Text style={styles.buttonText}>FINISH</Text>
                        </TouchableOpacity>
                    </Container>
                )
            }}
        </Query>
    )
    
  }
}