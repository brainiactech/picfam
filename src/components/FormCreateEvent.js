import React, { Component } from 'react'
import {  View, Picker} from 'react-native'
import {Container, Content,  Form, Item, Input, Label, Button,Text, Toast } from 'native-base';

import styles from './../event/style'; 
import { Query } from "react-apollo";
import { GET_GROUPLIST} from '../graph/queries/groupListQueries';
import {UppperCaseFirst} from '../../config/functions'; 

export default class FormCreateEvent extends Component {
    constructor(props){
        super(props); 
        this.state = { 
            group: "", title: "", description: "", eventType:"",
            showToast: false,
            groupList:""
          };
      }
      onInputTextChange = (text, type) => {
        this.setState({ [type]: text }); 
      }  

      doSubmit = () => {
            if(this.state.title != "" && this.state.eventType !="" && this.state.group !="" ){
                console.log(  this.state.title)
                this.state.title = UppperCaseFirst(this.state.title);
                this.state.description = UppperCaseFirst(this.state.description);  
                const { group, title, description, eventType } = this.state;
                this.props.handleSubmit({title, description, eventType, group});
                this.state.title="";
                this.state.description ="";
            }else{
            Toast.show({
                text: "Whoops! Add required information to the fields",
                type: "warning",
                duration: 4000
                });
            }
        } 

        loadGroupList() {
           const minusAdmin = this.state.groupList.filter(group => (group.user_type=="Admin"))
            return minusAdmin.map(groups => (<Picker.Item label={groups.group.title} value={groups.group._id} />))
        }

  render() {
    if(this.props.isError){
        Toast.show({
            text: this.props.isError,
            buttonText: 'Okay',
            type: "danger",
            duration: 4000
            });
    }   
    if(this.props.isSuccess){
        Toast.show({
            text: "Event was successfully created",
            type: "success",
            duration: 4000
            });
    }      
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
                if(data){
                    if(data.getUserGroups){ 
                         this.state.groupList = data.getUserGroups;
                    }
                }

               
                return(    
                    <Content style={styles.backgroundEdit}>
                        <Form>
                            <Picker
                                selectedValue={this.state.group}
                                onValueChange={(itemValue, itemIndex) => this.setState({group: itemValue})}>
                                <Picker.Item label="Pick Group" value="" />
                                {this.loadGroupList()}
                            </Picker>
                            <Item floatingLabel>
                                <Label>Event name</Label>
                                <Input onChangeText={text => this.onInputTextChange(text, 'title')}
                                    value={this.state.title} />
                            </Item>
                            <Item floatingLabel last>
                                <Label>Description</Label>
                                <Input onChangeText={text => this.onInputTextChange(text, 'description')} 
                                    value={this.state.description} />
                            </Item>
                            <Picker
                                selectedValue={this.state.eventType}
                                onValueChange={(itemValue, itemIndex) => this.setState({eventType: itemValue})}>
                                <Picker.Item label="Select Type" value="" />
                                <Picker.Item label="Public" value="Public" />
                                <Picker.Item label="Private" value="Private" />
                            </Picker>
                            <Button block rounded info style={styles.button} onPress={this.doSubmit} >
                                <Text>Create Event</Text>
                            </Button>
                        </Form>
                    </Content>)
            }}
        </Query>
    )
  }
}