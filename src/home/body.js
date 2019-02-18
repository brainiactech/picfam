import React, { Component } from 'react';
import { Content, Button, Text, Icon, Card, CardItem,Right,Body, ActionSheet,Root  } from 'native-base'; 
import { ScrollView, View, TouchableHighlight } from 'react-native'; 
import styles from './style'; 
import { Query } from "react-apollo";
import { GET_POPULAR_EVENTS} from '../graph/queries/eventPopularQueries';
import { GET_PHOTOS} from '../graph/queries/photoQueries';
import FitImage from 'react-native-fit-image';

var BUTTONS = [
    { text: "Create", icon: "add", iconColor: "#2c8ef4" },
    { text: "List", icon: "list", iconColor: "#f42ced" },
    { text: "Cancel", icon: "close", iconColor: "#25de5b" }
  ];
// var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 3;

export default class HomeBody extends Component {
    constructor(props) {
        super(props);
        this.state = {
            popularEvents:null, momentPhotos:null
        };
      }

    loadDetails() {   
    return this.state.popularEvents.map(events => {
        var totalPhotos = events.photo.length;
        var totalComments = 0; 
        var totalLikes = 0;
        var reactions = 0;

        for(i=0; i < totalPhotos; i++ ){
            totalLikes += parseInt(events.photo[i].photoLike.length);
            totalComments += parseInt(events.photo[i].photoComment.length);
        }
        reactions = totalPhotos + totalLikes + totalComments;
        const finalObject =<CardItem>
                    <Body>
                        <Text onPress={() =>this.props.theNav('Event',{eventId:events._id})}>{events.title}</Text>
                        <Text onPress={() =>this.props.theNav('Event',{eventId:events._id})} note>{reactions != 1?"reactions "+reactions :"reaction "+reactions}</Text>
                    </Body>
                    <Right>
                        <Icon name="arrow-forward" />
                    </Right>
                </CardItem>
            
        return finalObject;

    })

    }

    loadMomentImages() {  
        const minusPrivate = this.state.momentPhotos.filter(photos => (photos.event.e_type=="Public"))
        return minusPrivate.slice(0, 5).map(photos => (
               <TouchableHighlight style={{padding:2}} 
                    onPress ={() =>this.props.theNav("BrowsePicDetails",
                            {photo:photos._id, photoCreator:photos.user._id,
                                imageSource:photos.image_url,
                                username:photos.user.username,
                                event:photos.event._id,
                                eventTitle:photos.event.title,
                            })
                        } >
                    <FitImage 
                        source={{ uri: photos.image_url }}
                        style={styles.fitImageWithSize}
                    />        
                </TouchableHighlight>
            ))
        }


  render() {

    return (
        <Content style={styles.container}>
            <Text style={styles.groupHeader} note> Recent Pictures</Text>
    
            <View style={styles.defaultGroup}>
                <Query query={GET_PHOTOS} fetchPolicy="network-only">
                {({ loading, error, data }) => 
                { 
                    if (loading) return <Text> Loading...</Text>;
                    if (error) return <Text>Internet error...</Text>
                    if(data){ 
                        if(data.getPhotos){  
                            this.state.momentPhotos = data.getPhotos;
                        }
                    }
                    return(    
                        <ScrollView horizontal={true}>
                            {this.loadMomentImages()}
                        </ScrollView>
                        )
                    }}
                </Query>
   
            </View>

           
            <Text style={styles.groupHeader} note> Manage</Text>
            <View style={styles.groupNav}  >
                <Button  rounded light
                    onPress={() =>
                    ActionSheet.show(
                    {
                        options: BUTTONS,
                        cancelButtonIndex: CANCEL_INDEX,
                        //destructiveButtonIndex: DESTRUCTIVE_INDEX,
                        title: "Manage Groups"
                    },
                    buttonIndex => { 
                        try{
                            if(BUTTONS[buttonIndex].text == "Create" ){
                                this.props.theNav('CreateGroup')
                            }else if(BUTTONS[buttonIndex].text == "List" ){
                                this.props.theNav('ListGroup')
                            }
                        }catch(error){}
                    }
                    )}>
                    <Text>Groups</Text>
                </Button>
                
                <Button  rounded light
                    onPress={() =>
                    ActionSheet.show(
                    {
                        options: BUTTONS,
                        cancelButtonIndex: CANCEL_INDEX,
                        //destructiveButtonIndex: DESTRUCTIVE_INDEX,
                        title: "Manage Events"
                    },
                    buttonIndex => { 
                        try{
                            if(BUTTONS[buttonIndex].text == "Create" ){
                                this.props.theNav('CreateEvent')
                            }else if(BUTTONS[buttonIndex].text == "List" ){
                                this.props.theNav('ListEvent')
                            }
                        }catch(error){}
                    }
                    )}>
                    <Text>Events</Text>
                </Button>
            </View>

            <Text style={styles.groupHeader} note><Icon name="ios-pulse-outline" style={{color:'gray'}}/>  Popular Events</Text>
            <View style={styles.containerPopular}>
                <Query query={GET_POPULAR_EVENTS} fetchPolicy="network-only">
                {({ loading, error, data }) => 
                { 
                    if (loading) return <Text> Loading...</Text>;
                    if (error) return <Text>Internet error...</Text>
                    if(data){
                        if(data.getPopularEvents){ 
                            this.state.popularEvents = data.getPopularEvents;
                        }
                    }
                    return(    
                        <Card>
                             {this.loadDetails()}
                        </Card>
                        )
                    }}
                </Query>
            </View> 
        </Content> 
    )
  }
}
