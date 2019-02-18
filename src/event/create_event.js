import React, { Component } from 'react'
import { Text, Keyboard} from 'react-native'
import { Mutation } from "react-apollo";
import { Container } from 'native-base';
import { ADD_EVENT} from '../graph/mutations/eventMutation';
import { GET_USER_EVENTS} from '../graph/queries/eventListQueries';
import styles from './style'; 
import FormCreateEvent from '../components/FormCreateEvent';
import Loading from "../components/Loading";

export default class CreateEvent extends Component {
    constructor(props){
      super(props);
      this.state = { 
     
      };
      this.doSubmit = this.doSubmit.bind(this);
    }
  
    doSubmit(doAddEvent, obj, e){   
      Keyboard.dismiss(); 
      const { group, title, description, eventType } = e;
      const {data,loading, error} = obj;
      doAddEvent({variables: {title, description, eventType, group}});
    }

  render() {
    return (
      <Mutation mutation={ADD_EVENT} refetchQueries={[ {query:GET_USER_EVENTS}]}>
      {(addEvent, {data, loading, error }) => 
      (
        <Container style={styles.container}>
          {loading && <Loading/>}
          <Text note style={{padding:5}}>Organize your event under a group</Text>
          <FormCreateEvent 
                isError={ error? error.message:''}
                isSuccess={ data? data:''}
                handleSubmit={this.doSubmit.bind(this, addEvent, {data,loading, error})} />         
        </Container>
 
      )}
      </Mutation> 
    )
  }
}