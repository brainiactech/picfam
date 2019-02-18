import React, { Component } from "react";
import { Keyboard, View } from "react-native";
import { Container, Content, Form, Item, Input, Label, Button,Text, Toast} from "native-base";
import ImagePicker from "react-native-image-crop-picker";
import { init, UploadImage } from "react-native-cloudinary-x";
import styles from "./style";
import { ADD_PHOTO } from "../graph/mutations/photoMutation";
import { GET_USER_EVENTS } from "../graph/queries/eventListQueries";
import { GET_EVENTSCREEN } from "../graph/queries/eventScreenQueries";
import Loading from "../components/Loading";
import { ApolloConsumer } from 'react-apollo';

export default class AddPictureByEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showToast: false,
      eventList: "",
      description: "",
      imageUrl: "",
      event: "",
      eventName: "",
      loadingStatus: false,
      isImageUpLoaded: false,

    };
    this.doUploadImagePath2DB = this.doUploadImagePath2DB.bind(this);
    this.rncloudinary = this.rncloudinary.bind(this);
  }

  rncloudinary(client) {
    Keyboard.dismiss();
    this.setState({ loadingStatus: true });
    var API_KEY = "975939747142177";
    var API_SECRET = "ZyqCAHsIgEQex6zB1UWMLX-6k2M"
    var CLOUD_NAME = "pixfam"
    var PRESET_NAME = "vjofdtp1"
    
    init(API_KEY,API_SECRET, CLOUD_NAME)

    ImagePicker.openPicker({
        multiple: true
       }).then(images => {
          images.map(image =>{

                
            UploadImage(image.path)
                .then(res => {
                this.setState({ imageUrl: res });
                this.doUploadImagePath2DB(client,res);

                })
                .catch(err => {
                this.setState({ loadingStatus: false });
                Toast.show({
                    text: err.message,
                    buttonText: 'Okay',
                    type: "danger",
                    duration: 4000
                });
            });
          
      })
  
    }).catch(error=>{
      
        this.setState({ loadingStatus: false });
        Toast.show({
          text:"Thought you wanted to upload an image",
          buttonText: 'Okay',
          type: "warning",
          duration: 4000
        });

    });
  };


  async doUploadImagePath2DB(client, dImgUrl) {

    const { imageUrl, event, description } = this.state;
    this.setState({ loadingStatus: false });
    this.setState({ description: "" });
    var eventId = event;
    // console.log('imageUrl in state: ',imageUrl);
    // console.log('dImgurl from params : ',dImgUrl)

    client.mutate({
        variables: { imageUrl:dImgUrl, event, description },
        mutation: ADD_PHOTO,
        refetchQueries:[ 
          {query:GET_USER_EVENTS},
          {query: GET_EVENTSCREEN, variables: { eventId }}
        ]
      })
      .then(({data}) => { 
          if(data){
            { console.log('imageUrl from server: ',data.addPhoto.image_url)}
            if(!this.state.isImageUpLoaded)
            {
                this.props.navigation.navigate("BrowsePicDetails",
                {   photo:data.addPhoto._id, 
                    imageSource:data.addPhoto.image_url,
                    photoCreator:data.addPhoto.user._id,
                    username:data.addPhoto.user.username,
                    event:event,
                    eventTitle:"View pictures from event"
                });
                Toast.show({
                    text: "Photo upload was successful",
                    type: "success",
                    duration: 4000
                    });
                this.setState({isImageUpLoaded: true});    
            }
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
             // throw error;
        } }); 
  }

  onInputTextChange = (text, type) => {
    this.setState({ [type]: text });
  };
 

  render() {
    this.state.event = this.props.navigation.getParam("eventId");
    this.state.eventName = this.props.navigation.getParam("eventName");

    const toReturn = (
      <Container style={styles.container}>
        <Content style={styles.backgroundEdit}>
          <Form>
            <Text>Add pictures to {this.state.eventName}</Text>               
            <Item floatingLabel>
              <Label>Description</Label>
              <Input
                onChangeText={text => this.onInputTextChange(text, "description")}
                value={this.state.description}
              />
            </Item>
          
            <View>
                <ApolloConsumer>
                    {client => (
                      <Button block rounded info style={styles.button}
                        onPress={this.rncloudinary.bind(this, client)} >
                        <Text>Upload picture</Text>
                      </Button>
                    )}
                </ApolloConsumer>
            </View> 
          </Form>
        </Content>
    </Container>
    )

    return this.state.loadingStatus? <Loading />: toReturn;
  }
}
