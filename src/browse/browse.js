import React, { Component } from 'react';
import { Content} from 'native-base'; 
import { ScrollView, View, TouchableHighlight, Text  } from 'react-native'; 
import styles from './style'; 
import { Query } from "react-apollo";
import FitImage from 'react-native-fit-image';
import { GET_PHOTOS} from '../graph/queries/photoQueries';
import GridView from 'react-native-gridview';

export default class Browse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      freshPhotos:null,
    };
  }

  loadPublicImages(navigate) {  
    const minusPrivate = this.state.freshPhotos.filter(photos => (photos.event.e_type=="Public"))
    const itemsPerRow = 3;
    const randomizeRows = true;
    const data = minusPrivate.slice(0, 40);

    const randomData = [];
    for (let i = 0; i < data.length; i) {
      const endIndex = Math.max(Math.round(Math.random() * itemsPerRow), 1) + i;
      randomData.push(data.slice(i, endIndex));
      i = endIndex;
    }

    const dataSource = new GridView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2,
    }).cloneWithRows(randomData);

    return <GridView
            data={data}
            dataSource={randomizeRows ? dataSource : null}
            itemsPerRow={itemsPerRow}
            renderItem={(item) => {
            
              return (
                <View style={{ flex: 1}}>
                    <TouchableHighlight style={{padding:2}} 
                        onPress={() =>navigate("BrowsePicDetails",
                          {photo:item._id,photoCreator:item.user._id,
                            username:item.user.username,
                            oneSignalPlayerId: item.user.onesignal_playerId,
                            imageSource:item.image_url,
                            event:item.event._id,
                            eventTitle:item.event.title
                          })
                        }  >
                      <FitImage source={{ uri: item.image_url}} /> 
                    </TouchableHighlight> 
                </View>
              );
            }}
          />
    }

  render() {

    const { navigate } = this.props.navigation;
    return (
      <Content style={styles.container}>

          <View style={styles.defaultGroup}>

              <Query query={GET_PHOTOS} fetchPolicy="network-only">
              {({ loading, error, data }) => 
              { 
                  if (loading) return <Text> Loading...</Text>;
                  if (error) return <Text>Internet error...</Text>
                  if(data){ 
                      if(data.getPhotos){  
                          this.state.freshPhotos = data.getPhotos;
                      }
                  }
                  return(    
                      <ScrollView>
                          {this.loadPublicImages(navigate)}
                      </ScrollView>
                      )
               }}
              </Query>

          </View>

        
      </Content>    
    )
  }
}
