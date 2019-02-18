import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
      flex:1,
    padding: 10,
  },
  containerPopular: {
    flex:1,
    padding:10,
 },

  defaultGroup: {
    flex: 1, 
    flexDirection: 'row', 
    // justifyContent: 'space-around',
    padding: 5,
  },
  groupHeader:{
    paddingLeft:15,
    paddingTop:7,
    paddingBottom:10,

  },
  groupNav:{
    flex: 1,
    //padding:5,
    flexDirection: 'row', 
    // justifyContent: 'flex-start',
    justifyContent: 'space-around',
    // alignItems: 'flex-start'
  },

  fitImageWithSize: {
    height: 130,
    width: 130,
  },

});
  