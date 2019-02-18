import React, {StyleSheet} from 'react-native'

export default StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundContainer: {
        flex: 1,
        width: null,
        height: null,
    },
    sologanText: {
      alignItems: 'center',
      flexGrow: 1,
      paddingTop: 130,
      // fontSize: 56,
      justifyContent: 'center'
    },
    title:{
      color: '#000',
      marginTop: 10,
      // width: 140,
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
    loginTextContain:{
      flexGrow: 1,
      alignItems: 'center',
      justifyContent:'center',
      marginVertical: 16,
      flexDirection: 'row'
    },
    loginText: {
      color: '#2980b9',
    }
});
