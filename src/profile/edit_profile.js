import React, { Component } from 'react'
import { Text, Keyboard} from 'react-native'

import { Mutation } from "react-apollo";
import { Container } from 'native-base';

import { EDIT_PROFILE} from '../graph/mutations/profileMutation';
import { GET_PROFILE} from '../graph/queries/profileQueries';
import styles from './style'; 
import FormEditProfile from '../components/FormEditProfile';

export default class EditProfile extends Component {
    constructor(props){
      super(props);
      this.state = { 
        //loading: false,
      };
      this.doSubmit = this.doSubmit.bind(this);
    }
    
    doSubmit(doEditProfile, obj, e){
        Keyboard.dismiss();
        const { firstName, lastName, sex, dateOfBirth, bio } = e;
        const {data,loading, error} = obj;
        doEditProfile({variables: {firstName, lastName, sex, dateOfBirth, bio}}); 
    }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <Mutation mutation={EDIT_PROFILE} refetchQueries={[ {query:GET_PROFILE}]}>
        {(updateProfile, {data, loading, error }) => 
        (
          <Container style={styles.container}>
            <Text>{loading && 'Loading...'}</Text>
            {/* <Text>{data && 'success'}</Text> */}
              <FormEditProfile
                  isError={ error? error.message:''}
                  isSuccess={ data? data:''}
                  handleSubmit={this.doSubmit.bind(this, updateProfile, {data,loading, error})} theNav={navigate} />         
          </Container>
  
        )}
      </Mutation> 
    )
  }
}