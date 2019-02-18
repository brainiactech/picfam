import React, {StyleSheet} from 'react-native'

export default StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column', 
      // justifyContent: 'space-around',
      padding: 30
    },
    backgroundContainer: {
        flex: 1,
        width: null,
        height: null,
    },
    welcome: {
      // fontSize: 40,
      textAlign: 'center',
      color:'#C8D7F3', 
      marginTop:70,
    },
    sologanText: {
      color:'#FFF', 
      marginTop:20, 
      marginBottom:80, 
      textAlign:'center'
    },  
    buttonContainer:{
      backgroundColor:'#2980b9',
      paddingVertical:15,
      borderRadius :20,
      marginTop:120,
    },
    buttonText:{
        textAlign: 'center',
        color: '#ffffff',
        fontWeight:'700'
    },
});
