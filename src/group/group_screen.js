import React, { Component } from 'react'
import { Container, Content, Badge, Icon, View, Text, H3} from 'native-base';
import { List, ListItem, Body, Thumbnail, Toast, Fab} from 'native-base';

import styles from './style'; 
import { Query } from "react-apollo";
import { GET_GROUP_EVENTLIST} from '../graph/queries/groupEventListQueries';

export default class GroupScreen extends Component {
    constructor(props){
        super(props);
        this.state = { 
           showToast: false
        };
    }
  render() {
    const { navigate } = this.props.navigation;
    const groupId = this.props.navigation.getParam('groupId');
    const groupMember = this.props.navigation.getParam('groupMember');

    return (
        <Query query={GET_GROUP_EVENTLIST} variables={{ groupId }} fetchPolicy="network-only">
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
            if(data){ console.log('there is data');
                if(data.getGroup){ 
                    theList = (
                        <List dataArray={data.getGroup.event}
                        renderRow={(events) =>
                         <ListItem>
                            <View style={styles.groupBox} >
                                <H3 style={{padding:15, color:"#FFF"}} 
                                    onPress={() =>navigate('Event',{eventId:events._id})}>{events.title.charAt(0)}</H3>
                            </View>
                         <Body>
                             <Text onPress={() =>navigate('Event',{eventId:events._id})}>{events.title}</Text>
                             <Text note>{events.description}</Text>
                         </Body>
                     </ListItem>
                        }>
                    </List>)
                }
            }

            return(   
                <Container style={styles.container}>
                    <Content>
                        <View style={styles.metricsContainer}>
                        
                            <Text onPress={() =>navigate('GroupMember',{groupId:groupId})}>  
                                {groupMember==1?"  Participant":"  Participants"} </Text>
                            <Badge success>
                                <Text>{groupMember}</Text>
                            </Badge>
                        </View> 
                        <H3 style={styles.header}>Events under {data.getGroup.title}</H3>
                        <Text note>{data.getGroup.description}</Text>
                        
                        {theList}
                    </Content>
                    <Fab style={{ backgroundColor: '#FF6600', marginBottom:40 }}
                        position="bottomRight"
                        onPress={() =>navigate('CreateEvent')}>
                        <Icon name="add" />
                    </Fab>
                </Container>
                )
            }}
        </Query>
    )
  }
}
