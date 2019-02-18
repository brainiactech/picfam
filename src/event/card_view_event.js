import React, { Component } from 'react'
import { View, Text, Keyboard,ScrollView} from 'react-native';
import { Card, CardItem, Left, Body, Icon, Button, Form, Item, Input,Toast } from 'native-base';
import { Mutation } from "react-apollo";
import styles from './style'; 
import { ADD_PHOTO_COMMENT } from '../graph/mutations/photoCommentMutation';
import { ADD_PHOTO_LIKE } from '../graph/mutations/photoLikeMutation';
import { ADD_PHOTO_VIEW } from '../graph/mutations/photoViewMutation';
import { GET_USER_PHOTO} from '../graph/queries/photoByUserQueries';
import PictureShareIcon from '../picture/pic_share_icon'
import FitImage from 'react-native-fit-image';
import {sendPushNotification} from '../../config/functions';
import {ONESIGNAL_APPID} from '../../config/constants';
export default class CardViewEvent extends Component {
  constructor(props){
    super(props); 
    this.state = {
      showToast: false,
      comment:null,photo:null,
      photoCreator:null,
      photoWasViewed: false
    };
    this.doSubmit = this.doSubmit.bind(this);
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
      if(this.props.oneSignalPlayerId !=null){
        var message = { 
          app_id: ONESIGNAL_APPID,
          headings: {"en": "Pixfam App"},
          contents: {"en": "Fresh comment on your picture at "+this.props.eventTitle+" event"},
          include_player_ids: [this.props.oneSignalPlayerId]
        };
        sendPushNotification(message);
      }
      this.state.photo = this.props.photo
      this.state.photoCreator = this.props.userId;
      const { comment, photo, photoCreator } = this.state;
      doComment({variables: {comment, photo, photoCreator}});
      this.state.comment = null
    }
  }

  doSubmitLike = (doLike) => {
    this.state.photo = this.props.photo
    const {photo } = this.state;
    doLike({variables: {photo}});
  }

  doSubmitView = (doView)=>{
    if(!this.state.photoWasViewed){
      this.state.photo = this.props.photo
      const {photo} = this.state;
      doView({variables: {photo}});
      //console.log('got shown')
    }
    this.state.photoWasViewed = true;
  }

  callSocialShare(){
    console.log('got hit')
    // return <SocialShare visible={true}/>//.Share.open(shareImageBase64);
  }


  render() {
    const eventId = this.props.eventId;
    const userId = this.props.userId;
    return (
      
        <Card >
            <CardItem>
              <Left>
                  <Text note>{this.props.dateCreated}</Text>
              </Left>  
            </CardItem>
            <CardItem cardBody>
              <Mutation mutation={ADD_PHOTO_VIEW}>
                  {(doView, {data, loading, error }) => 
                  (     
                    <ScrollView onTouchStart={this.doSubmitView.bind(this, doView, {data,loading, error})} >
                        {loading && null}
                        {error && null}{data && null}
                        <FitImage 
                            source={{ uri:this.props.imageSource}} 
                        /> 
                    </ ScrollView>
                  )}
              </Mutation> 
            </CardItem>

            <CardItem style={{height:30}}>
              <Left>
                  <Mutation mutation={ADD_PHOTO_LIKE} 
                        refetchQueries={[ {query:GET_USER_PHOTO, variables:{userId, eventId}}]}>
                        {(doLike, {data, loading, error }) => 
                        (                    
                        <Button transparent  >
                            {loading && <Text>saving...</Text>}
                            {error && null}{data && null}
                            {this.props.isLikedByUser
                                ?<Icon name="heart" style={{ color: '#ED4A6A' }} onPress={this.doSubmitLike.bind(this, doLike)} />
                                :<Icon name="ios-heart-outline" style={{color:"black"}} onPress={this.doSubmitLike.bind(this, doLike)} />
                              }    
                        <Text> {this.props.likes}</Text> 
                      </Button>
                    )}
                  </Mutation> 

                  <Button transparent  onPress={() =>this.props.theNav('EventPicComment', 
                          {photo:this.props.photo,
                          photoCreator:this.props.userId,
                          likes:this.props.likes,
                          comments:this.props.comments,
                          oneSignalPlayerId:this.props.oneSignalPlayerId,
                          eventTitle : this.props.eventTitle,
                          username:this.props.picCreatorUsername})}>
                    <Icon name="ios-chatbubbles-outline" style={{color:"black"}} />
                    <Text> {this.props.comments !=0?this.props.comments:null}</Text> 
                  </Button>
                  <Button transparent>
                    <Icon name="ios-eye-outline" style={{color:"black"}} />
                    <Text> {this.props.view}</Text>
                  </Button>
                  <PictureShareIcon 
                      imageSource={this.props.imageSource}
                      eventTitle ={this.props.eventTitle}/>
                  {/* <Button transparent  onPress={this.callSocialShare}>
                    <Icon name="ios-send-outline" style={{color:"black"}} />
                  </Button> */}
                    
              </Left>
            </CardItem>

            <CardItem>
              <Body  style={{  flex:1, flexDirection: 'column', alignItems:'stretch'}}>
                <Text note>{this.props.description}</Text>
                <View>
                      {this.props.lastComment
                          ?<Text>{this.props.lastCommentFromUser
                            ?<Text style={{fontWeight:"900" }}>{this.props.lastCommentFromUser} </Text>:null}
                            {this.props.lastComment}</Text>
                          :null
                      } 
                    <Mutation mutation={ADD_PHOTO_COMMENT} 
                              refetchQueries={[ {query:GET_USER_PHOTO, variables:{userId, eventId}}]}>
                      {(doComment, {data, loading, error }) => 
                      (           
                          <Form style={{padding:8,}}>
                              {loading && <Text>sending...</Text>}
                                {error && Toast.show({
                                            text: "Something went wrong. Try again",
                                            type: "warning",
                                            duration: 4000
                                            })}
                                {data &&  Toast.show({
                                            text: "Comment saved",
                                            type: "success",
                                            duration: 4000
                                            }) 
                                }
                              <Item rounded >
                              <Input placeholder='Add comment' 
                                  onChangeText={text => this.onInputTextChange(text, 'comment')} 
                                  value={this.state.comment} />
                              <Icon  name="send" onPress={this.doSubmit.bind(this, doComment, {data,loading, error})} />
                              </Item>
                          </Form>
                        )}
                    </Mutation> 
              </View>
              </Body>
            </CardItem>      
        </Card>         

    ) 
  }
}
