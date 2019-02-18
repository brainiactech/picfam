import React, { Component } from 'react';
import { View } from 'react-native'; 
import { Container, Content, List, ListItem, Thumbnail, Text, Body, Button, H3, Toast } from 'native-base';
import styles from './style'; 
import { Query } from "react-apollo";
import { GET_PUBLIC_PROFILE} from '../graph/queries/profilePublicQueries';

export default class PublicProfile extends Component {
    constructor(props){
        super(props);
        this.state = {
          showToast: false
        };
    }
      
  render() {
    const { navigate } = this.props.navigation;
    const user = this.props.navigation.getParam("userId");
    return (

        <Query query={GET_PUBLIC_PROFILE} variables={{ user }} >
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

           if(data){ 
               loadingIt = ""; errorShit = "";
                if(data.getPublicProfile.groupMember){
                    
                    groupList = (
                        <List dataArray={data.getPublicProfile.groupMember}
                        renderRow={(groups) =>
                            <ListItem>
                                <View style={styles.groupBox} >
                                    <H3 style={{padding:15, color:"#FFF"}}>{groups.group.title.charAt(0)}</H3>
                                </View>                                
                                <Body>
                                    <Text>{groups.group.title}</Text>
                                    <Text note>{groups.member.length==1?groups.member.length+" Participant":groups.member.length+" Participants"} . . .</Text>
                                </Body>
                            </ListItem>
                            }>
                        </List>)
                }
                if(data.getPublicProfile.eventMember){
                    const minusPrivateEvent = data.getPublicProfile.eventMember.filter(value => (value.event.e_type=="Public"))

                    eventList=(
                        <List dataArray={minusPrivateEvent}
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
                if(data.getPublicProfile.first_name){
                    name= data.getPublicProfile.first_name+" "+data.getPublicProfile.last_name ;
                }else{
                    name = data.getPublicProfile.user.username;
                }

            }
            return(
                <Container  style={styles.container}>            
                    <View style={styles.containerPublic}>
                        <List>
                            <ListItem>
                            <Thumbnail large source={{ uri: data.getPublicProfile.user.image_path }} />           
                            <Body style={styles.itemPad} >
                                <H3 style={styles.itemPad}>{name}</H3>
                                <Text style={styles.itemPadBottom} note>{data.getPublicProfile.country}.{data.getPublicProfile.state}</Text>
                                <Text>{data.getPublicProfile.bio}</Text>
                            </Body> 
                           
                            </ListItem>
                        </List>
                    </View>
                    <Content>
                        <Text note style={styles.groupHeader}>MY GROUPS</Text>    
                        {groupList}
                        <Text note style={styles.groupHeader}>MY PUBLIC EVENTS</Text>
                        {eventList}
                    </Content>
                </Container>  
                )
                
            }}
        </Query>
       
    )
  }
}
