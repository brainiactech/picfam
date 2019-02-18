import React, { Component } from 'react'
import {  View, Picker, DatePickerIOS, DatePickerAndroid} from 'react-native'
import {Container, Content,  Form, Item, Input, Label, Button,Text,Toast } from 'native-base';

import styles from './../profile/style'; 
import { Query } from "react-apollo";
import { GET_PROFILE} from '../graph/queries/profileQueries';

export default class FormEditProfile extends Component {
    constructor(props){
        super(props); 
        this.state = { 
            firstName: null, lastName:null, sex: "", dateOfBirth: "", bio:null, 
            ourdate:"",
            showToast: false,
          }; 
      }
      onInputTextChange = (text, type) => {
        if( text.length == 0){
            this.setState({ [type]:"" }); 
        }
        else this.setState({ [type]: text });  
    }  
      doSubmit = () => {
          if(this.state.firstName != "" && this.state.lastName !="" && this.state.sex !="" && this.state.bio !="" && this.state.dateOfBirth !=""){
            const {firstName, lastName, sex, bio, dateOfBirth} = this.state;
            this.props.handleSubmit({firstName, lastName, bio, sex, dateOfBirth});
          }else{
            Toast.show({
                text: "Whoops! Add required information to the fields",
                type: "warning",
                duration: 4000
                });
          }
      } 

      getDate = async () =>{ 
        try {
            const {action, year, month, day} = await DatePickerAndroid.open({
              date: new Date()
            });
            if (action !== DatePickerAndroid.dismissedAction) {
              this.setState({ourdate: {year, month, day}})
              this.state.dateOfBirth =  year+'/'+month+'/'+day;
            }
          } catch ({code, message}) {
            console.warn('Cannot open date picker', message);
          }        
      }
  
    
  render() {
      const our_date = this.state.ourdate;
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
                text: "Profile update successful",
                type: "success",
                duration: 4000
            });
            this.props.theNav('Profile');
        }         

    return (
        <Query query={GET_PROFILE}>
            {({ loading, error, data }) => {
         
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
            return(
                <Content style={styles.backgroundEdit}>
                    <View style={styles.itemPad}>
                        <Form>
                            <Item floatingLabel>
                                <Label>First Name</Label>
                                <Input onChangeText={text => this.onInputTextChange(text, 'firstName')}
                                    value={this.state.firstName != null? this.state.firstName: this.state.firstName = data.getProfile.first_name} />
                            </Item>
                            <Item floatingLabel>
                                <Label>Last Name</Label>
                                <Input onChangeText={text => this.onInputTextChange(text, 'lastName')}
                                    value={this.state.lastName != null ?this.state.lastName :this.state.lastName = data.getProfile.last_name} />
                            </Item>
                            <Picker
                                selectedValue={this.state.sex != null ?this.state.sex : this.state.sex = data.getProfile.sex}
                                onValueChange={(itemValue, itemIndex) => this.setState({sex: itemValue})} style={styles.picker}>
                                <Picker.Item label="Pick a sex" value="" />
                                <Picker.Item label="Male" value="Male" />
                                <Picker.Item label="Female" value="Female" />
                            </Picker>
                        
                            <Text onPress={this.getDate} style={styles.picker} >{our_date? our_date.year+'/'+our_date.month+'/'+our_date.day : 
                                                                                data.getProfile.date_of_birth? data.getProfile.date_of_birth:"Date of Birth"}</Text>
                            <Item floatingLabel>
                                <Label>Who are you?</Label>
                                <Input onChangeText={text => this.onInputTextChange(text, 'bio')}
                                    value={this.state.bio != null? this.state.bio :this.state.bio = data.getProfile.bio} />
                            </Item>
                            <Button  block rounded info style={styles.editButton} onPress={this.doSubmit} >
                                <Text>Save Profile</Text>
                            </Button>
                        </Form>
                    </View>
                </Content>
            )
          }}
          </Query>
    )
  }
}