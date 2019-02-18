import React, { Component } from 'react'
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Toast, View } from 'native-base';
import { Card, CardItem, H3, Fab, Icon } from 'native-base';
import { TouchableHighlight } from 'react-native';
import styles from './style'; 
import { Query } from "react-apollo";
import { GET_EVENT_MEMBERS} from '../graph/queries/eventMemberQueries';

 
export default class EventParticipants extends Component {
    constructor(props){
        super(props);
        this.state = { 
           showToast: false,
           groupMemberId: null,
        };
    }

  render() {
    const { navigate } = this.props.navigation;
    const eventId =  this.props.navigation.getParam('eventId');

    return (

        <Query query={GET_EVENT_MEMBERS} variables={{eventId}}>
        {({ loading, error, data }) => 
        { 
            var theList = null;
            if (loading) return <Text> Loading...</Text>;
            if (error){
                Toast.show({
                    text: error.message,
                    buttonText: 'Okay',
                    type: "danger",
                    duration: 10000
                    });
                    return <Text> Whoops! Something got broken</Text>;
            }
            if(data){ console.log('there is data');
           
                if(data.getEventMembers){ 

                    //is user a member
                    theList = (
                        <List dataArray={data.getEventMembers}
                            renderRow={(members) =>
                                <ListItem avatar>
                                <Left>
                                    <TouchableHighlight onPress={() =>this.props.navigation.navigate('PublicProfile',{userId:members.user._id})} >
                                      <Thumbnail source={{uri: members.user.image_path}} />
                                    </TouchableHighlight>  
                                </Left>
                                <Body>
                                    <Text>{members.user.profile.first_name
                                        ?members.user.profile.first_name+" "+members.user.profile.last_name
                                        :members.user.username}
                                    </Text>
                                    <Text note>{members.user.profile?members.user.profile.bio:"Yep! I am on Pixfam"}..</Text>
                                </Body>
                                {members.user_type=="Admin"?<Right><Text note>admin</Text></Right>:<Text></Text>}           
                            </ListItem>
                        }>
                    </List>)
                }
            }
            

            return(
                <Container style={styles.container}>
                    <H3 style={styles.header}>{data.getEventMembers[0].event.title}</H3> 
                    <Content>
                        <Card>
                            <CardItem header style={{height:10}} >
                                <Text>Event Description</Text>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text note>{data.getEventMembers[0].event.description}</Text>
                                </Body>
                            </CardItem>
                        </Card>

                        <Text note style={{paddingTop:20}}> Event participants</Text>
                        <View>
                            {theList}
                        </View>
                    </Content>
                     
                    <Fab
                        style={{ backgroundColor: '#FF6600' }}
                        position="bottomRight"
                        onPress={() =>navigate('AddPictureByEvent',{eventName:data.getEventMembers[0].event.title, eventId:eventId})}>
                        <Icon name="add" />
                    </Fab>  
                </Container>
            )   
        }}
        </Query>
    )
  }
}
