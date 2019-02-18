import React, { Component } from 'react';
import { Text, View, ToastAndroid, PermissionsAndroid } from 'react-native';
import Share, { Button} from 'react-native-share';
import {Icon} from 'native-base';
import RNFetchBlob from "react-native-fetch-blob";

export default class PictureShareIcon extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      imageBase64: null,
      isLoading: false,
    }
  }

  async componentWillMount() {
    const granted = await PermissionsAndroid.check(
      'android.permission.WRITE_EXTERNAL_STORAGE'
     );
     if (!granted) {
      const response = await PermissionsAndroid.request(
        'android.permission.WRITE_EXTERNAL_STORAGE'
      );
      if (!response) {
        return;
      }
     }
  }

  onCancel() {
    this.setState({visible:false});
  }

  async onOpen() {
    this.setState({isLoading:true});
    ToastAndroid.show('Hold on, this could take a while', ToastAndroid.LONG)
    const fs = RNFetchBlob.fs;
    let imagePath = null;
    
    RNFetchBlob.config({
      fileCache: true
    })
      .fetch("GET", this.props.imageSource)
      // the image is now downloaded to device's storage
      .then(resp => {
        // the image path you can use it directly with Image component
        imagePath = resp.path();
        return resp.readFile("base64")
        .then(base64Data => {
          // here's base64 encoded image
          // console.log(base64Data);
          // remove the file from storage
          fs.unlink(imagePath);
          return { resp, base64Data };
        })
      })
     
      .then(obj => {
        console.log(obj)
        var headers = obj.resp.respInfo.headers;
        var type = headers['Content-Type'];
        var dataUrl = 'data:' + type + ';base64,' + obj.base64Data;
        this.setState({imageBase64:dataUrl});
        console.log(dataUrl)

        this.setState({visible:true});
        let shareImageBase64 = {
          title: "Share Pixfam with",
          message: "*PIXFAM* shares awesome pictures from "+this.props.eventTitle,
          type: 'image/png',
          url: dataUrl,
          subject: "Pixfam Event" //  for email
        };
     
        Share.open(shareImageBase64)
        this.setState({isLoading:false});


      })
      .catch(err=>{
        // console.log(err)
        this.setState({isLoading:false});
        ToastAndroid.show('Internet connect got broken. Try again!', ToastAndroid.LONG)
      });

  }

  render() {
    
    return (
      <View >
        {this.state.isLoading
          ?<Text note>loading...</Text>
          :<Button transparent onPress={this.onOpen.bind(this)}>
            <Icon name="ios-send-outline" style={{color:"black"}} />
          </Button>
        }
      </View>
    );
  }
}