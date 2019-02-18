import React, { Component } from 'react'
import { Keyboard} from 'react-native'
import { Container, Content, Form, Item, Input, Label, Button,Text,Toast } from 'native-base';
import styles from './style'; 
import { Mutation } from "react-apollo";
import {ADD_GROUP } from '../graph/mutations/groupMutation';
import { GET_GROUPLIST} from '../graph/queries/groupListQueries';
import {UppperCaseFirst} from '../../config/functions'; 
import Loading from "../components/Loading";

export default class CreateGroup extends Component {
  constructor(props){
    super(props); 
    this.state = {
      title: "", description: "",
      showToast: false
    };
    this.doSubmit = this.doSubmit.bind(this);
  }

  onInputTextChange = (text, type) => {
    this.setState({ [type]: text });
    //this.state.showToast = false;
  } 
 
  doSubmit = (doAddGroup, obj, e) => {
    Keyboard.dismiss();
    if(this.state.title != ""){
      this.state.title = UppperCaseFirst(this.state.title);
      this.state.description = UppperCaseFirst(this.state.description);
      const { title, description } = this.state;
      const {data,loading, error} = obj;
     doAddGroup({variables: {title, description}}); 
     this.state.title=""; 
     this.state.description="";

    }else{
      Toast.show({
          text: "Aw! Provide Group title",
          type: "warning",
          duration: 4000
          });
    }
  }
  
  uppperCaseFirst(str){
    return str.charAt(0).toUpperCase + str.slice(1);
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
      <Mutation mutation={ADD_GROUP} refetchQueries={[ {query:GET_GROUPLIST}]}>
      {(addGroup, {data, loading, error }) => 
      (
       
        <Container style={styles.container}>
            {loading && <Loading/>}
            {error && <Text>Error :( Please try again</Text>}
            {data &&  Toast.show({
                        text: "Group was successfully created",
                        type: "success",
                        duration: 4000
                        })
            }
            
            <Text note style={{padding:5}}>Create a group to organize similar events</Text>

            <Content style={styles.backgroundEdit}>
              <Form >
                <Item floatingLabel>
                  <Label>Group name</Label>
                  <Input onChangeText={text => this.onInputTextChange(text, 'title')}
                    value={this.state.title} />
                </Item>
                <Item floatingLabel last>
                  <Label>Description</Label>
                  <Input onChangeText={text => this.onInputTextChange(text, 'description')} 
                    value={this.state.description}/>
                </Item>
                <Button block rounded info style={styles.button} onPress={this.doSubmit.bind(this, addGroup, {data,loading, error})}>
                  <Text>Create Group</Text>
                </Button>
              </Form>
            
            </Content>
        </Container>
      )}
      </Mutation> 
    )
  }
}

