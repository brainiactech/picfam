import gql from "graphql-tag";

export const GET_EVENT_PHOTO_COMMENT = gql`
query getPhotoComments($photoId: ID!) {

    getPhotoComments (photo: $photoId){
        _id,comment
        user{
          _id,username,image_path
          profile{
              _id,last_name, first_name
          }
        }
    }
  }
`
;