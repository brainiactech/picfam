import React, { Component } from 'react'
import { Container, Header, Content, List, ListItem, Text, Badge, View, H3, Icon, Body, Toast} from 'native-base';
import styles from './style'; 
import globalColor from '../../config/app-colors'; 
import { Query } from "react-apollo";
import { GET_GROUPLIST} from '../graph/queries/groupListQueries';

export default class ListGroup extends Component {
    constructor(props){
        super(props);
        this.state = { 
           loading: false, created: false, errorMessage: false ,
           loadingText: "", groups: null, groupArray: null,
           showToast: false
        };
    }
  
  render() {
    const { navigate } = this.props.navigation;
    return (

        <Query query={GET_GROUPLIST}>
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
                    if(data.getUserGroups){ 
                        theList = (
                            <List dataArray={data.getUserGroups}
                            renderRow={(groups) =>
                            <ListItem>
                                <Body >
                                    <Text  onPress={() =>navigate('Group',{groupId:groups.group._id, groupMember:groups.member.length})}>{groups.group.title}</Text>
                                    <Text note onPress={() =>navigate('Group',{groupId:groups.group._id, groupMember:groups.member.length})}>{groups.member.length==1?groups.member.length+" member":groups.member.length+" members" }</Text>
                                </Body>
                    
                                {groups.user_type=="Admin"?<Text note style={globalColor.appDarkPrimaryColor} 
                                        onPress={() =>navigate('AddGroupMember',{groupId:groups.group._id,groupTitle:groups.group.title})}>add</Text>:<Text></Text>}
                            </ListItem>
                            }>
                        </List>)
                    }
                }
                

            return(
                <Container style={styles.container}>
                <Content>
                    <View style={styles.metricsContainer}>
                        {/* <Text>Pictures </Text>
                        <Badge>
                            <Text>2</Text>
                        </Badge> */}
                        {/* <Text onPress={() =>navigate('GroupMember')}>  Members </Text>
                        <Badge success>
                            <Text>2</Text>
                        </Badge>
                        <Text  onPress={() =>navigate('ListEvent')}>  Events </Text>
                        <Badge primary>
                            <Text>45</Text>
                        </Badge> */}
                    </View> 
                    <View style={styles.listHeader}> 
                         <Icon name="add" style={{paddingRight:15}}
                            onPress={() =>navigate('CreateGroup')}/>
                        <H3 style={styles.header}>
                          Followed Groups
                        </H3>
                    </View>   
                    <View>
                        {theList}
                    </View>
                </Content>
            </Container>)

            }}
        </Query>

    )
  }
}
