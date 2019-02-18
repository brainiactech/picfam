import React, { Component } from 'react'
import { Container, Header,Button,  Icon, Item, Input, Text, StyleProvider, Badge } from 'native-base'; 
import getTheme from '../../native-base-theme/components';
import material from '../../native-base-theme/variables/material';
import { Query } from "react-apollo";
import { GET_REQUESTS} from '../graph/queries/requestQueries';

export default class HomeHeader extends Component {
    constructor(props){
        super(props);
        this.state = { 
         notificationCount: 0,
        };
    }
  render() {
    return (

            <StyleProvider style={getTheme(material)}>
            <Header searchBar rounded>
                <Item>
                    <Icon name="ios-search" />
                    <Input placeholder="Search events" style={{backgroundColor: 'rgba(225,225,225,0.2)',}} />
                    <Query query={GET_REQUESTS} fetchPolicy="network-only">
                        {({ loading, error, data }) => 
                        { 
                            if (loading) return <Text> </Text>;
                            if (error)return <Text> </Text>;
                            
                            if(data){
                                if(data.getRequests.length > 0){ 
                                    this.state.notificationCount =data.getRequests.length;
                                }
                            }
                     
                            return(
                                <Button badge onPress={() => this.props.theNav('Notification') } style={{backgroundColor:'#2980b9'}}>
                                    <Icon name="notifications" />
                                    {this.state.notificationCount !=0
                                        ?<Badge><Text>{this.state.notificationCount}</Text></Badge>
                                        :null
                                    }    
                                </Button>
                                )
                        }}
                    </Query>
                        
                </Item>
                <Button transparent>
                    <Text>Search events</Text>
                </Button>
            </Header>
        </StyleProvider >
              
       
    )
  }
}
