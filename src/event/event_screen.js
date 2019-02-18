import React, { Component } from 'react'
import { TouchableHighlight} from 'react-native';
import { Container, Content, List, ListItem, Text, Badge, View, Icon, Toast} from 'native-base';
import { Thumbnail, Left, Body, H3, Fab, Button, Form } from 'native-base';
import styles from './style'; 
import { AsyncStorage } from 'react-native';
import { Mutation } from "react-apollo";
import { SEND_JOIN_EVENT_REQUEST } from '../graph/mutations/sendJoinEventRequestMutation';
import { Query } from "react-apollo";
import { GET_EVENTSCREEN} from '../graph/queries/eventScreenQueries';

export default class EventScreen extends Component {

    constructor(props){
        super(props);
        this.state = { 
           showToast: false,
           eventDetail: null,
           email:"no@mail.com",
           isAMember: false,
           event:null, receiverUser:null, status:"Pending",requestType:"Join",
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
   
    loadDetails(eventId, eventTitle) {  
        
        return this.state.eventDetail.map(details => {

            var commentCount = 0 ;
            var likeCount = 0;
            var photoCount = details.photo.length;
            for(i=0; i < photoCount; i++){
                commentCount +=   details.photo[i].photoComment.length; 
                likeCount +=   details.photo[i].photoLike.length;                   
            }
           const toReturn =  (<ListItem avatar>
                <Left>
                    <TouchableHighlight onPress={() =>this.props.navigation.navigate('PublicProfile',{userId:details.user._id})} >
                    <Thumbnail source={{ uri: details.user.image_path }}  />
                    </TouchableHighlight>

                </Left>
                <Body>
                    <Text onPress={() =>this.props.navigation.navigate('EventDetails',{userId:details.user._id, eventId:eventId,eventTitle:eventTitle, oneSignalPlayerId:details.user.onesignal_playerId})}>
                        {details.user.profile.first_name
                        ?(details.user.profile.first_name+" "+details.user.profile.last_name)
                        :details.user.username}
                    </Text>
                    <Text note onPress={() =>this.props.navigation.navigate('EventDetails',{userId:details.user._id, eventId:eventId,eventTitle:eventTitle})}>
                        {likeCount ==0 ?"":likeCount > 1?likeCount+" likes | ":likeCount+" like | "} 
                        {commentCount ==0 ?"":commentCount > 1?commentCount+" comments | ":commentCount+" comment | "}
                        {photoCount > 1?photoCount+" pictures":photoCount+" picture"}
                    </Text>
                </Body>
            </ListItem>)
            return toReturn;
        })
    }

    getTotalPictures(){
        var  myEvent = this.state.eventDetail;
        var pictures =0;
        if( myEvent){
            for (let index = 0; index <  myEvent.length; index++) {
                const element =  myEvent[index];
                pictures = parseInt(pictures) + parseInt(element.photo.length)
                element.user.email == this.state.email? this.state.isAMember = true :""
            }
           return pictures
        }
    }

    doSubmit = (doSendInvite, obj, e) => {
    
        const { receiverUser, event, status, requestType } = this.state;
        const {data,loading, error} = obj;
        doSendInvite({variables: {receiverUser, event,status, requestType}});
       
      }
    
  render() {
    const { navigate } = this.props.navigation;
    const eventId = this.props.navigation.getParam('eventId');
    
    return (  
        <Query query={GET_EVENTSCREEN} variables={{ eventId }} fetchPolicy="network-only" pollInterval={60000}>
            {({ loading, error, data }) => 
            { 
                var theList = null; totalPictures =null;
                var eventData = null;
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
                if(data){ 
                    eventData = data;
                    this.state.receiverUser = eventData.getEvent.group.user._id
                    this.state.event = eventId
                    if(eventData.getEvent.eventMember){ 
                         this.state.eventDetail = eventData.getEvent.eventMember;
                         totalPictures = this.getTotalPictures();
                    }
                }

            return(    
                <Container style={styles.container}>
                     <Mutation mutation={SEND_JOIN_EVENT_REQUEST}>
                        {(doSendRequest, {data, loading, error }) => 
                        ( <Form>
                            {loading && <Text>Loading...</Text>}
                            {error?
                            Toast.show({
                                text: error.message,
                                type: "danger",
                                duration: 4000
                                }):<Text></Text>}

                            {data?
                            data.sendJoinEventRequest.status == "Pending"
                                ?Toast.show({
                                text: "Your request was successful",
                                type: "success",
                                duration: 4000
                                })
                                :Toast.show({
                                    text: "You have already requested an invite",
                                    type: "warning",
                                    duration: 4000
                                    })
                            :<Text></Text>
                            }  
                            <View style={styles.metricsContainer}>
                                <Text> Pictures  </Text>
                                <Badge>
                                    <Text>{totalPictures}</Text>
                                </Badge>

                                {this.state.isAMember
                                    ?<Text onPress={() =>navigate('EventParticipant',{eventId:eventId})}>  
                                    {eventData.getEvent.eventMember.length==1?"  Participant ":"  Participants "} 
                                    </Text>
                                    :<Text>  </Text>
                                }
                                {this.state.isAMember
                                    ?<Badge success>
                                        <Text>{eventData.getEvent.eventMember.length}</Text>
                                    </Badge>
                                    :<Button small success onPress={this.doSubmit.bind(this, doSendRequest, {data,loading, error})}><Text> Join </Text></Button>
                                }    
                            
                            </View>
                        </Form>

                        )}
                    </Mutation>   
                    <H3 style={{fontWeight:"300", paddingBottom:10, paddingTop:10}}>{eventData.getEvent.title}</H3> 
                    <Text note>Created by : {eventData.getEvent.group.user.username}</Text>
                  
                    <Content >
                        <List>
                           {this.loadDetails(eventId, eventData.getEvent.title)}
                        </List>
                    </Content>  
                    {this.state.isAMember
                        ?<Fab
                            style={{ backgroundColor: '#FF6600' }}
                            position="bottomRight"
                            onPress={() =>navigate('AddPictureByEvent',{eventName:eventData.getEvent.title, eventId:eventId})}>
                            <Icon name="camera" />
                        </Fab>  
                        :<Text></Text>
                    }

                </Container>)

            }}
        </Query>
    )
  }
}
