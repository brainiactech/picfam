import React, { Component } from 'react';
import { View } from 'react-native'; 
import { Container, Content, List, ListItem, Thumbnail, Text, Body, Button, H3, Toast } from 'native-base';
import styles from './style'; 
import globalColor from '../../config/app-colors'; 
import { Query } from "react-apollo";
import { GET_PROFILE} from '../graph/queries/profileQueries';
import { EDIT_PROFILE_PHOTO} from '../graph/mutations/profilePhotoMutation';
import ImagePicker from "react-native-image-crop-picker";
import { init, UploadImage } from "react-native-cloudinary-x";
import { ApolloConsumer } from 'react-apollo';
import Loading from "../components/Loading";


export default class Profile extends Component {
    constructor(props){
        super(props);
        this.state = {
          showToast: false, imageUrl: "",loadingStatus: false,
        };
    }

    rncloudinary(client) {
        this.setState({ loadingStatus: true });
        var API_KEY = "975939747142177";
        var API_SECRET = "ZyqCAHsIgEQex6zB1UWMLX-6k2M"
        var CLOUD_NAME = "pixfam"
        var PRESET_NAME = "vjofdtp1"
        
        init(API_KEY,API_SECRET, CLOUD_NAME)
    
        ImagePicker.openPicker({
          // multiple: true
        }).then(images => {
            var data = new FormData();
            data.append("upload_preset", PRESET_NAME);
            data.append("path", images.path);
            var dindex = images.path.lastIndexOf("/");
            var imagename = images.path.substring(dindex + 1);
          
            data.append("file", {
              uri: images.path,
              name: imagename,
              type: images.mime 
            });
              
            UploadImage(images.path)
              .then(res => {
                this.setState({ imageUrl: res });
                this.doUploadImagePath2DB(client);
    
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
    
    
      async doUploadImagePath2DB(client) {

        const {imageUrl} = this.state;
        this.setState({ loadingStatus: false });
            console.log(imageUrl)

        client.mutate({
            variables: { imageUrl },
            mutation: EDIT_PROFILE_PHOTO,
            refetchQueries:[{query:GET_PROFILE} ]
          })
          .then(({data}) => { 
              if(data){
                Toast.show({
                      text: "Yeah! You have new profile picture",
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
                 // throw error;
            } }); 
      }
      
  render() {
    const { navigate } = this.props.navigation;
    return (

        <Query query={GET_PROFILE}>
            {({ loading, error, data }) => {
            var groupList = null; var eventList=null;
            var name = null;

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

           if(data){ console.log('there is data'); loadingIt = ""; errorShit = "";
                if(data.getProfile.groupMember){
                    
                    groupList = (
                        <List dataArray={data.getProfile.groupMember}
                        renderRow={(groups) =>
                            <ListItem>
                                <View style={styles.groupBox} >
                                    <H3 style={{padding:15, color:"#FFF"}} 
                                        onPress={() =>navigate('Group',{groupId:groups.group._id})}>{groups.group.title.charAt(0)}</H3>
                                </View>                                
                                <Body>
                                    <Text  onPress={() =>navigate('Group',{groupId:groups.group._id})}>{groups.group.title}</Text>
                                    <Text note>{groups.member.length==1?groups.member.length+" Participant":groups.member.length+" Participants"} . . .</Text>
                                </Body>
                            </ListItem>
                            }>
                        </List>)
                }
                if(data.getProfile.eventMember){
                    eventList=(
                        <List dataArray={data.getProfile.eventMember}
                        renderRow={(events) =>
                            <ListItem>
                                <Body>
                                    <Text  onPress={() =>navigate('Event',{eventId:events.event._id})}>{events.event.title}</Text>
                                    <Text note>{events.event.description}</Text>
                                </Body>
                            </ListItem>
                        }>
                    </List>
                    ) 
                }
                if(data.getProfile.first_name){
                    name= data.getProfile.first_name+" "+data.getProfile.last_name ;
                }else{
                    name = data.getProfile.user.username;
                }

            }
            return(
                <Container  style={styles.container}>            
                    <View style={styles.containerWhite}>
                        <List>
                            <ListItem>
                                <Body >
                                    {this.state.loadingStatus? <Loading/>:<Thumbnail large source={{ uri: data.getProfile.user.image_path }} />}
                                    <View>
                                        <ApolloConsumer>
                                            {client => (
                                            <Text note onPress={this.rncloudinary.bind(this, client)} >
                                               {this.state.loadingStatus?" saving...": "Change image"}
                                            </Text>
                                            )}
                                        </ApolloConsumer>
                                    </View>      
                                </Body>
                                <Body style={styles.itemPad} >
                                    <H3 style={styles.itemPad}>{name}</H3>
                                    <Text style={styles.itemPadBottom} note>{data.getProfile.country}.{data.getProfile.state}</Text>
                                    <Button  rounded info  onPress={() =>navigate('EditProfile')}>
                                        <Text>Edit Profile</Text>
                                    </Button>
                                </Body> 
                            </ListItem>
                        </List>
                    </View>
                    <Content>
                        <Text note style={styles.groupHeader}>MY GROUPS</Text>    
                        {groupList}
                        <Text note style={styles.groupHeader}>MY EVENTS</Text>
                        {eventList}
                        <Text>{console.log(data.getProfile)}</Text>
                    </Content>
                </Container>  
                )
                
            }}
        </Query>
    )

  }
}
