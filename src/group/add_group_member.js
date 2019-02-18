import React, { Component } from 'react'
import { Container, Content,Text, Item, View, Icon, Input, H3, Form, Button, Toast} from 'native-base';
import styles from './style'; 
import { Keyboard, Linking } from 'react-native'
import { Mutation } from "react-apollo";
import { SEND_GROUP_INVITE } from '../graph/mutations/sendGroupInviteMutation';
import { USER_SEARCH} from '../graph/queries/userSearchQueries';
import { ApolloConsumer } from 'react-apollo';
import {sendPushNotification} from '../../config/functions';
import {ONESIGNAL_APPID} from '../../config/constants';
export default class AddGroupMember extends Component {
  constructor(props){
    super(props);
    this.state = { 
       showToast: false,
       findUser:null, findUserResult:"Search on Pixfam to add", findUserStatus:false,
       timeout: null,
       group:null, receiverUser:null, receiverUserOneSignalID:null,
       status:"Pending",requestType:"Invite",
       message:["searching...","searching for user...","user not found. Try again!"]
    };
  }

  async doSearchOnTextChange  (text,type, dClient){
      this.setState({ [type]: text });
      clearTimeout(this.state.timeout);
      this.state.timeout  = setTimeout(function(){
        console.log('Input value:', text );
        //this.doSearch(client);
      }, 500);
      this.setState({ [type]: text });

      const { data } = await dClient.query({
        query: USER_SEARCH,
        variables: { searchQuery: text }
      });
      try{
        //console.log(data.userSearch.username);
        this.state.findUserStatus = true;
        this.state.receiverUser = data.userSearch._id
        this.state.receiverUserOneSignalID = data.userSearch.onesignal_playerId

        this.onResultGotten(data.userSearch.username+" was found. Invite user");
      }catch (error){
        this.state.findUserStatus = false;
        var random = Math.floor((Math.random())*(3-0))+0;
        this.onResultGotten(this.state.message[random]);
      }
    
  }
  doShareLink(){
    var message = "*PIXFAM:* A quick way to share event photos with friends: https://pixfam123.page.link/app";
    var url = 'whatsapp://send?text='+message;
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  doSubmit = (doSendInvite, groupTitle) => {
    Keyboard.dismiss();
    if(this.state.findUser ==null){
      Toast.show({
        text: "Whoops! Enter the user detail",
        type: "warning",
        duration: 4000
        });
    }else if(!this.state.findUserStatus){
      Toast.show({
        text: "Aw! Enter a valid user to continue",
        duration: 4000
        });
    }else{
      if(this.state.receiverUserOneSignalID !=null){
        var message = { 
          app_id: ONESIGNAL_APPID,
          headings: {"en": "Pixfam App"},
          contents: {"en": "Someone on Pixfam invites you to join "+groupTitle+" group"},
          include_player_ids: [this.state.receiverUserOneSignalID]
        };
        sendPushNotification(message);
      }
      const { receiverUser, group, status,requestType } = this.state;
      doSendInvite({variables: {receiverUser, group,status,requestType}});
      this.state.findUser= null;

    }
  }

  onResultGotten = findUserResult => this.setState(() => ({findUserResult}));

  render() {
    this.state.group = this.props.navigation.getParam('groupId');
    const groupTitle = this.props.navigation.getParam('groupTitle');
    return (
      <Container style={styles.container}>
          
          <H3 style={styles.header}>Add friends to {groupTitle}</H3>
          <Content style={styles.backgroundEdit}>
              <Text style={{marginBottom:15}}>Friends you add to a group will have access to all the events under this group</Text>

              <Mutation mutation={SEND_GROUP_INVITE}>
                {(doSendRequest, {data, loading, error }) => 
                (
                <Form>
                    {loading && <Text>Loading...</Text>}
                    {error?
                      Toast.show({
                        text: error.message,
                        type: "danger",
                        duration: 4000
                        }):null}

                    {data?
                      data.sendGroupInvite.status == "Pending"
                        ?Toast.show({
                          text: "Invite was successful. Add another user",
                          type: "success",
                          duration: 4000
                          })
                        :Toast.show({
                            text: "You have already invited this user",
                            type: "warning",
                            duration: 4000
                            })
                      :null
                    }  
                  <View style={{paddingTop:5, paddingBottom:15 }}>
                  <Text note style={{marginBottom:10}}>{this.state.findUserResult}</Text>

                    <ApolloConsumer>
                        {client => (
                          <Item rounded >
                            <Input placeholder='Search username or email'   
                            autoCapitalize="none"
                            autoCorrect={false}
                            onChangeText={text => this.doSearchOnTextChange(text,'findUser',client)}
                            value={this.state.findUser} />
                            <Icon  name="send" onPress={this.doSubmit.bind(this, doSendRequest, groupTitle)} />
                          </Item>
                        )}
                    </ApolloConsumer>
                  </View>
                </Form>
                )}
              </Mutation> 

          
              <Text style={{paddingTop:30, paddingBottom:10 }} note >Share link with friends to add to group</Text>
              <Button  full rounded info onPress={this.doShareLink}>
                   <Text>Share group link</Text>
              </Button>
          </Content>   
      </Container>
    )
  }
}
