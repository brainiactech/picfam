import React, { Component } from 'react'
import { Alert, TouchableHighlight} from 'react-native'; 
import { Container, Content, View,List, ListItem, Body, Left, Thumbnail, Text, Toast } from 'native-base';
import styles from './style';
import globalColor from '../../config/app-colors'; 
import { Query } from "react-apollo";
import { GET_REQUESTS} from '../graph/queries/requestQueries';
import { RESPOND_2_JOIN } from '../graph/mutations/respond2JoinEventMutation';
import { RESPOND_2_INVITE } from '../graph/mutations/respond2InviteMutation';
import { CLEAR_COMMENT_NOTIFICATION } from '../graph/mutations/clearCommentNotificationMutation';
import { ApolloConsumer } from 'react-apollo';
export default class Notification extends Component {
    constructor(props){
        super(props);
        this.state = { 
           showToast: false,
           requestId: null, responseType: null
        };
    }

    showAlertRequestDialog = (requestID, client) =>{
        Alert.alert(
            '',
            'Notification response',
            [
              {text: 'Accept', onPress: this.doSubmitInviteRequest.bind(this, requestID, client, "Accept")},
              {text: 'Reject', onPress: this.doSubmitInviteRequest.bind(this, requestID, client,"Reject"), style: 'cancel'},
            ],
          )
    }
      
    showAlertJoinRequestDialog = (requestID, client) =>{
        Alert.alert(
            '',
            'I want to Join',
            [
              {text: 'Accept', onPress: this.doSubmitJoinRequest.bind(this, requestID, client, "Accept")},
              {text: 'Reject', onPress: this.doSubmitJoinRequest.bind(this, requestID, client,"Reject"), style: 'cancel'},
            ],
          )
    }
    
    showAlertCommentDialog = (requestID, client,photoID, photoUrl) =>{
        Alert.alert(
            '',
            'Comment notification',
            [
              {text: 'View', onPress: this.doClearNotification.bind(this, requestID, client, photoID, photoUrl, "View")},
              {text: 'Clear', onPress: this.doClearNotification.bind(this, requestID, client, photoID, photoUrl, "Clear"), style: 'cancel'},
            ],
            // { cancelable: false }
          )
    }
    
    async doSubmitInviteRequest(requestId, client, responseType) {
        client.mutate({
            variables: {requestId, responseType},
            mutation: RESPOND_2_INVITE,
            refetchQueries:[ {query:GET_REQUESTS}]
            })
          .then(data => { 
              if(data.data.respond2Invite.status != null){
                  Toast.show({
                      text: "You have "+data.data.respond2Invite.status+" the invite",
                      type: "success",
                      duration: 4000
                      });
              }else{
                  Toast.show({
                      text: "Some strange went wrong",
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

    async doSubmitJoinRequest(requestId, client, responseType) {
        client.mutate({
            variables: {requestId, responseType},
            mutation: RESPOND_2_JOIN,
            refetchQueries:[ {query:GET_REQUESTS}]
            })
          .then(data => { 
              if(data.data.respond2JoinEventRequest.status != null){
                  Toast.show({
                      text: "You have "+data.data.respond2JoinEventRequest.status+" the invite",
                      type: "success",
                      duration: 4000
                      });
              }else{
                  Toast.show({
                      text: "Some strange went wrong",
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

    async doClearNotification(requestId, client, photoID, photoUrl, userResponse) {
        if(userResponse=="View"){
           this.props.navigation.navigate("EventPicComment",{photo:photoID, imageSource:photoUrl});
        }else{
            client.mutate({
                variables: {requestId},
                mutation: CLEAR_COMMENT_NOTIFICATION,
                refetchQueries:[ {query:GET_REQUESTS}]
                })
              .then(data => { 
                //   console.log("here is result: ",data.data)
                //   console.log(JSON.stringify(data.data, null, 4))
                 if(data.data.clearCommentNotification.status == "Cleared"){
                      Toast.show({
                          text: "Comment notification cleared",
                          type: "success",
                          duration: 4000
                          });
                  }else{
                      Toast.show({
                          text: "Some strange went wrong",
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
    }

    render() {
        return (

            <Query query={GET_REQUESTS} fetchPolicy="network-only">
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
                    if(data.getRequests.length > 0){ 
                        theList = (
                            <List dataArray={data.getRequests}
                            renderRow={(requestDetails) =>
                            <ListItem avatar>
                                <Left>
                                    <TouchableHighlight onPress={() =>this.props.navigation.navigate('PublicProfile',{userId:requestDetails.senderUser._id})} >
                                         <Thumbnail small source={{ uri: requestDetails.senderUser.image_path}}/>
                                    </TouchableHighlight>     
                                </Left>
                                <Body>

                                    {requestDetails.group
                                        ?<Text note>You are invite to join {requestDetails.group.title} group</Text>:null}
                                    {requestDetails.event
                                        ?<Text note>{requestDetails.requestType == "Invite"
                                                    ?"An invite for you to join"
                                                    :"Someone request to join"} {requestDetails.event.title +" event"}</Text>
                                        :null          
                                    }
                                    {requestDetails.photo
                                        ?<Text note>Fresh comment on your picture</Text>:null}
                                    <Text>From {requestDetails.senderUser.profile.first_name
                                                ?requestDetails.senderUser.profile.first_name+" "+requestDetails.senderUser.profile.last_name
                                                :requestDetails.senderUser.username}</Text>
                                </Body>
                                
                                {requestDetails.photo
                                    ?<View>
                                        <ApolloConsumer>
                                            {client => (
                                            <Text note 
                                                onPress={this.showAlertCommentDialog.bind(this, 
                                                requestDetails._id, client, requestDetails.photo._id, 
                                                requestDetails.photo.image_url)} 
                                                style={globalColor.appDarkPrimaryColor}>act</Text>
                                                )}
                                        </ApolloConsumer>
                                    </View>
                                    :requestDetails.requestType == "Invite"
                                    ?<View>
                                        <ApolloConsumer>
                                            {client => (
                                            <Text note 
                                                onPress={this.showAlertRequestDialog.bind(this, 
                                                requestDetails._id,client)} 
                                                style={globalColor.appDarkPrimaryColor}>respond</Text>
                                            )}
                                        </ApolloConsumer>
                                    </View>
                                    :<View>
                                        <ApolloConsumer>
                                            {client => (
                                            <Text note 
                                                onPress={this.showAlertJoinRequestDialog.bind(this, 
                                                requestDetails._id,client)} 
                                                style={globalColor.appDarkPrimaryColor}>respond</Text>
                                            )}
                                        </ApolloConsumer>
                                    </View>                
                                }    
                            </ListItem>
                            }>
                        </List>)
                    }else{
                        Toast.show({
                            text: "You have no pending request",
                            duration: 4000
                            });
                            return <Text> Aw! You have no pending request</Text>;
                    }
                }
                     
                return(
                    <Container style={styles.container}>
                        <Content>
                            {theList}
                        </Content>
                    </Container>     
                )
            }}
            </Query>

        )
    }
}
