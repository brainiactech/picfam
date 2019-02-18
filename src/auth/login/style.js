import React, {StyleSheet} from 'react-native'

export default StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: '#3498db',
    },
    backgroundContainer: {
        flex: 1,
        width: null,
        height: null,
    },
    sologanText: {
      alignItems: 'center',
      flexGrow: 1,
      paddingTop: 120,
      // fontSize: 56,
      justifyContent: 'center'
    },
    title:{
      marginTop: 15,
      textAlign: 'center',
      opacity: 0.5
    },
    formContainer: {
      padding:30,
    },
    input:{
        height:40,
        backgroundColor: 'rgba(225,225,225,0.2)',
        marginBottom: 10,
        color: '#000',
        paddingHorizontal: 10,
    },
    buttonContainer:{
        backgroundColor:'#2980b9',
        paddingVertical:15,
        borderRadius :20
    },
    buttonText:{
        textAlign: 'center',
        color: '#ffffff',
        fontWeight:'700'
    },
    signupTextContain:{
      flexGrow: 1,
      alignItems: 'center',
      justifyContent:'center',
      marginVertical: 16,
      flexDirection: 'row'
    },
    signupText: {
      color: '#2980b9',
    }
});
