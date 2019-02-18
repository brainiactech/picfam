import React, { Component } from 'react'
import { Container, Content,Text,H3,Toast, Thumbnail, Body, List,ListItem} from 'native-base';
import CardViewEvent from './card_view_event'
import styles from './style'; 
import { Query } from "react-apollo";
import { GET_USER_PHOTO} from '../graph/queries/photoByUserQueries';
import { AsyncStorage, TouchableHighlight } from 'react-native';
import { FormatDate } from '../../config/functions'; 

export default class EventDetails extends Component {
    constructor(props){
        super(props);
        this.state = { 
           showToast: false,
           userPhotoDetails: null,
           username: "",profileImage:null,
           email:"no@mail.com"
        };
    }

    async componentWillMount() {
        try 
        {    
             await AsyncStorage.setItem('teststuff1','testvalue1');
             this.state.email = await AsyncStorage.getItem('@pixfam_email');
        } catch (error) {
            console.log('error: '+error.message);  
        } 
    };
    loadDetails() {   

            return this.state.userPhotoDetails.map(details => {

            var photolikes = details.photoLike;
            var photoIsLikedByUser = false;
            for(i=0; i < photolikes.length; i++){
                const element =  photolikes[i];
                if(this.state.email == element.user.email){
                    photoIsLikedByUser = true;
                    break;
                }
            }
            const returnBack=  <CardViewEvent theNav={this.props.navigation.navigate} 
                picCreatorUsername={this.state.username}
                imageSource={details.image_url}
                photo={details._id}
                description={details.description}
                view={details.view}
                dateCreated = {FormatDate(details.createdAt)}
                likes={details.photoLike.length}
                isLikedByUser ={photoIsLikedByUser}
                lastComment ={details.photoComment.length !=0?details.photoComment[details.photoComment.length-1].comment:null }
                lastCommentFromUser ={details.photoComment.length !=0?details.photoComment[details.photoComment.length-1].user.username:null }
                comments={details.photoComment.length}
                userId ={this.props.navigation.getParam('userId')}
                oneSignalPlayerId ={this.props.navigation.getParam('oneSignalPlayerId')}
                eventId ={this.props.navigation.getParam('eventId')}
                eventTitle = {this.props.navigation.getParam('eventTitle')}
                />

            return returnBack;
        })
    }

    

  render() {
    const { navigate } = this.props.navigation;
    const eventId = this.props.navigation.getParam('eventId');
    const eventTitle = this.props.navigation.getParam('eventTitle');
    const userId = this.props.navigation.getParam('userId');


    return (
        <Query query={GET_USER_PHOTO} variables={{ userId, eventId }} fetchPolicy="network-only">
        {({ loading, error, data }) => 
        { 
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
                if(data.getUserPhotos){ 
                    this.state.userPhotoDetails = data.getUserPhotos;
                    var photoData =  data.getUserPhotos;
                   try{
                        this.state.profileImage =photoData[0].user.image_path
                        if(photoData[0].user.profile.length > 0){
                            this.state.username= photoData[0].user.profile.first_name+" "+photoData[0].user.profile.last_name;
                        }else{
                            this.state.username =photoData[0].user.username;
                        }
                   }catch(err){
                    Toast.show({
                        text:"Event album is empty",
                        buttonText: 'Okay',
                        type: "warning",
                        duration: 4000
                        });
                   }
                   
                } 
            }

            return(    
                <Container style={styles.containerCardByPic}>
                    <List>
                        <ListItem>
                            <TouchableHighlight onPress={() =>this.props.navigation.navigate('PublicProfile',{userId:userId})} >
                                 <Thumbnail source={{ uri: this.state.profileImage}}/>
                            </TouchableHighlight>    
                            <Body style={{padding:5}} >
                                <H3>{eventTitle}</H3> 
                                <Text note>            
                                    Pictures by {this.state.username}
                                </Text>
                            </Body> 
                        </ListItem>
                    </List>

                    <Content style={styles.eventScreenContainer}>
                        {this.loadDetails()}
                    </Content>
                </Container> 
            )
        }}
        </Query>
    )
  }
}
