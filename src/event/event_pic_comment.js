import React, { Component } from 'react'
import { ScrollView, View, Keyboard, Image, TouchableHighlight} from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body,Toast} from 'native-base';
import { List, ListItem, Item, Input, Form } from 'native-base';
import { Query } from "react-apollo";
import { Mutation } from "react-apollo";
import { ADD_PHOTO_COMMENT } from '../graph/mutations/photoCommentMutation';
import { GET_EVENT_PHOTO_COMMENT} from '../graph/queries/photoCommentQueries';
import styles from './style'; 
import FitImage from 'react-native-fit-image';
import {sendPushNotification} from '../../config/functions';
import {ONESIGNAL_APPID} from '../../config/constants';

export default class EventPicComment extends Component {
  constructor(props){
    super(props);
    this.state = { 
       showToast: false,comment:null,photo:null,
       photoCreator:null,
      };
  }

  onInputTextChange = (text, type) => {
    this.setState({ [type]: text });
  } 

  doSubmit = (doComment) => {
    Keyboard.dismiss();

    if(this.state.comment == null){
      Toast.show({
        text: "Whoops! Type a message",
        type: "warning",
        duration: 4000
        });
    }else{
      if(this.props.navigation.getParam('oneSignalPlayerId') !=null){
        var message = { 
          app_id: ONESIGNAL_APPID,
          headings: {"en": "Pixfam App"},
          contents: {"en": "Your picture from "+this.props.navigation.getParam('eventTitle')+" got a new comment"},
          include_player_ids: [this.props.navigation.getParam('oneSignalPlayerId')]
        };
        sendPushNotification(message);
      }
      this.state.photo = this.props.navigation.getParam('photo');
      this.state.photoCreator = this.props.navigation.getParam('photoCreator');
      const { comment, photo,photoCreator } = this.state;
      doComment({variables: {comment, photo, photoCreator}});
      this.state.comment = null
    }
  }


  render() {
    const photoId = this.props.navigation.getParam('photo');
    const username = this.props.navigation.getParam('username');
    const comments = this.props.navigation.getParam('comments');
    const likes = this.props.navigation.getParam('likes');


    return (
      <ScrollView style={styles.container}>
          <Card  style={styles.borderEventRadius}>

              <CardItem style={{height:40,  borderRadius :7}} >
                <Left>
                  <Button transparent>
                    <Icon  name="ios-heart" style={{ color: '#ED4A6A' }}/>
                    <Text>{likes?likes > 1?likes+" likes":likes+" like":likes+" like"}</Text>
                  </Button>
                  <Button transparent  >
                    <Icon  name="ios-chatbubbles-outline" />
                    <Text>{comments?comments > 1?comments+" comments":comments+" comment":comments+" comment"}</Text>
                  </Button>
                </Left>
              </CardItem>
          </Card>

      <Text note style={{padding:10}}>Reactions to {username} picture</Text> 
      
      <Query query={GET_EVENT_PHOTO_COMMENT} variables={{ photoId }} fetchPolicy="network-only">
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
                        return <Text> Whoops! Something got bursted</Text>;
                }
                if(data.getPhotoComments){ 
                  theList = (
                    <List dataArray={data.getPhotoComments}
                      renderRow={(photoComments) =>
                      <ListItem avatar>
                          <Body>
                            <View style={{  flex:1, flexDirection: 'row'}}>
                                <TouchableHighlight onPress={() =>this.props.navigation.navigate('PublicProfile',{userId:photoComments.user._id})} >
                                   <Thumbnail small source={{ uri: photoComments.user.image_path}}/>
                                </TouchableHighlight>   
                                <Text style={{padding:5}}>
                                    {photoComments.user.profile.first_name
                                    ?photoComments.user.profile.first_name+" "+photoComments.user.profile.last_name
                                    :photoComments.user.username}
                                </Text>
                            </View>
                            <Text note>{photoComments.comment}</Text>
                          </Body>
                      </ListItem>
                    }>
                </List>)
                }

            return(    
              <View style={styles.containerPicComment}>
                {theList}
                <Mutation mutation={ADD_PHOTO_COMMENT} 
                              refetchQueries={[ {query:GET_EVENT_PHOTO_COMMENT, variables:{photoId}}]}>
                      {(doComment, {data, loading, error }) => 
                      (           
                    <Form>
                        <View style={{padding:20 , marginBottom:20}}>
                            {loading && <Text>sending...</Text>}
                              {error && Toast.show({
                                          text: "Something went wrong. Try again",
                                          type: "warning",
                                          duration: 4000
                                          })}
                              {data &&  Toast.show({
                                          text: "Your comment saved",
                                          duration: 2000
                                          }) 
                              }
                            <Item rounded >
                            <Input placeholder='Add comment' 
                                onChangeText={text => this.onInputTextChange(text, 'comment')} 
                                value={this.state.comment} />
                            <Icon  name="send" onPress={this.doSubmit.bind(this, doComment, {data,loading, error})} />
                            </Item>
                        </View>
                    </Form>
                  )}
              </Mutation> 
            </View>)
            
          }}
          </Query>
    
    
    </ScrollView>

    )
  }
}
