import React, { Component } from 'react';
import { Picker, Keyboard } from 'react-native'; 
import { Container, Content, View, Form, Item, Input, Label, Button, Text, Toast} from 'native-base';
import styles from './style'; 
import { Query } from "react-apollo";
import { init, UploadImage } from "react-native-cloudinary-x";
import {ADD_PHOTO } from '../graph/mutations/photoMutation';
import { GET_USER_EVENTS} from '../graph/queries/eventListQueries';
import Loading from "../components/Loading";
import { ApolloConsumer } from 'react-apollo';
import ImagePicker from "react-native-image-crop-picker";


export default class AddPictureByEventList extends Component {
    constructor(props){
        super(props); 
        this.state = { 
            showToast: false,
            eventList:"", event:"",description:"", imageUrl:"",
            loadingStatus: false,
            isImageUpLoaded: false,
          };
          this.doUploadImagePath2DB = this.doUploadImagePath2DB.bind(this);
          this.rnCloudinary = this.rnCloudinary.bind(this);
    }

    onInputTextChange = (text, type) => {
        this.setState({ [type]: text });
    } 
    
    loadEventList() {
    return this.state.eventList.map(events => (
        <Picker.Item label={events.event.title} value={events.event._id} />
        ))
    }

    rnCloudinary(client) {

        if(this.state.event ==""){
            Toast.show({
                text:"You forgot to add an event",
                type: "warning",
                duration: 4000
            });
            return;
        }
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
                    this.doUploadImagePath2DB(client, res);
    
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

        client.mutate({
            variables: { imageUrl:dImgUrl, event, description },
            mutation: ADD_PHOTO,
            refetchQueries:[ 
                {query:GET_USER_EVENTS},
            ]
            })
            .then(({data}) => { 
                if(data){
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
                    type: "danger",
                    duration: 4000
                    });
                    // throw error;
            } 
        }); 
    }

  render() {
    const { navigate } = this.props.navigation;

    const toReturn = (
    
        <Query query={GET_USER_EVENTS}>
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
                    if(data.getUserEvents){ 
                        this.state.eventList = data.getUserEvents;
                   }
                }
            return(
               
                <Container  style={styles.container}>  
                    <Content style={styles.backgroundEdit}>
                    <Form>
                        <Picker
                            selectedValue={this.state.event}
                            onValueChange={(itemValue, itemIndex) => this.setState({event: itemValue})}>
                            <Picker.Item label="Select Event" />
                            {this.loadEventList()}
                        </Picker>
                        <Item floatingLabel>
                            <Label>Description</Label>
                            <Input onChangeText={text => this.onInputTextChange(text, 'description')}
                                value={this.state.description} />
                        </Item>
                        <View>
                            <ApolloConsumer>
                                {client => (
                                <Button block rounded info style={styles.button}
                                    onPress={this.rnCloudinary.bind(this, client)} >
                                    <Text>Upload picture</Text>
                                </Button>
                                )}
                            </ApolloConsumer>
                        </View> 
                    </Form>
                    </Content>
                </Container>
              
            )
        }}
        </Query>

    )

    return this.state.loadingStatus? <Loading />: toReturn;
  }
}
