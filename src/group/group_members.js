import React, { Component } from 'react'
import { Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Text, Toast, View } from 'native-base';
import { Card, CardItem, H3, Fab, Icon } from 'native-base';
import { Alert, TouchableHighlight } from 'react-native';
import styles from './style'; 
import { graphql} from 'react-apollo';
import { Query } from "react-apollo";
import { GET_GROUP_MEMBERS} from '../graph/queries/groupMemberQueries';
import { MAKE_GROUP_ADMIN } from '../graph/mutations/groupAdminMutation';


class GroupMember extends Component {
    constructor(props){
        super(props);
        this.state = { 
           showToast: false,
           groupMemberId: null,
        };
    }

    showAlertDialog = (groupMemberID, groupID) =>{
 
        Alert.alert(
            '',
            'Edit User Access',
            [
              {text: 'Make Admin',onPress: this.doSubmit.bind(this, groupMemberID,groupID)},
            ],
            // { cancelable: false }
          )
    }

    doSubmit= async (groupMemberID, groupId)=> {
        this.state.groupMemberId = groupMemberID;
        const {groupMemberId} = this.state
        try {
            console.log(groupId)
           const {data} = await this.props.mutate({variables:{groupMemberId}, refetchQueries:[{query:GET_GROUP_MEMBERS, variables:{groupId}}]} )
            if(data.makeGroupAdmin.user_type == "Admin"){
                Toast.show({
                    text: "User is now an Admin",
                    type: "success",
                    duration: 4000
                  });
            }else{
                Toast.show({
                    text: "Some strange went wrong",
                    type: "warning",
                    duration: 4000
                  });
            }
            
        }catch(error){
            Toast.show({
                text: error.message,
                buttonText: 'Okay',
                type: "danger",
                duration: 4000
              });
              throw error;
        }
    }
 
  render() {
    const { navigate } = this.props.navigation;
    const groupId = this.props.navigation.getParam('groupId');

    return (

        <Query query={GET_GROUP_MEMBERS} variables={{groupId}}>
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
                    if(data.getGroupMembers){ 
                        theList = (
                            <List dataArray={data.getGroupMembers}
                                renderRow={(members) =>
                                <ListItem avatar>
                                <Left>
                                    <TouchableHighlight onPress={() =>this.props.navigation.navigate('PublicProfile',{userId:members.user._id})} >
                                        <Thumbnail source={{uri: members.user.image_path}}/>
                                    </TouchableHighlight>    
                                </Left>
                                <Body>
                                    <Text onPress={this.showAlertDialog.bind(this,members._id,groupId)}>
                                        {members.user.profile.first_name
                                            ?members.user.profile.first_name+" "+members.user.profile.last_name
                                            :members.user.username}</Text>
                                    <Text note onPress={this.showAlertDialog.bind(this,members._id,groupId)}>{members.user.profile?members.user.profile.bio:"Yep! I am on Pixfam"}..</Text>
                                </Body>
                                {members.user_type=="Admin"?<Right><Text note>admin</Text></Right>:<Text></Text>}
                            </ListItem>
                            }>
                        </List>)
                    }
                }
                

            return(
                <Container style={styles.container}>
                    <Content>
                        <Card>
                            <CardItem header style={{height:10}} >
                                <Text>{data.getGroupMembers[0].group.title}</Text>
                            </CardItem>
                            <CardItem>
                                <Body>
                                    <Text note>{data.getGroupMembers[0].group.description}</Text>
                                </Body>
                            </CardItem>
                        </Card>

                        <Text note style={{paddingTop:20}}> Group Members</Text>
                        <View>
                            {theList}
                        </View>
                    </Content>
                </Container>
            )

        }}
        </Query>
    )
  }
}

export default graphql(MAKE_GROUP_ADMIN) ( GroupMember);

