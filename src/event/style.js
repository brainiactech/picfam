import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  container: {
    flex:1,
    //flexDirection: 'column', 
    padding: 15,
  },
  
  containerCardByPic: {
    flex:1,
    padding: 1,
  },
  containerPicComment :{
    backgroundColor:'#fff',
    borderRadius :7
  },
  button:{
    marginTop:30
  },
  metricsContainer:{
    flexDirection: 'row', 
    justifyContent: 'flex-start',
    paddingBottom:20,
  },
  headingContainer:{
    padding:10
  },
  cardContainer:{
  //  flex:1,
   flexDirection: 'column', 
   justifyContent: 'flex-start',
  },
  listHeader:{
    flexDirection: 'row', 
  },
  header:{
    fontWeight:"500",
    opacity: 0.4,
    paddingBottom: 20
  },
  eventScreenContainer:{
    flex: 1,
    backgroundColor: "#E6E6E6"
  },
  backgroundEdit:{
    flex: 1, 
    padding: 10,
    borderRadius :7,
    backgroundColor: '#FFF'
  },
  borderEventRadius:{
    borderRadius :7
  },
  
  fitImageWithSize: {
    height: 400,
    width: 350,
  },
  
});
  