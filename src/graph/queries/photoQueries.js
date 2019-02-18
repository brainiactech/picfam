import gql from "graphql-tag";

export const GET_PHOTOS = gql`
query getPhotos{

    getPhotos{
       _id
       image_url,
       user{
           _id,username,onesignal_playerId
       }
       event{
           _id,title
           e_type
       }
    }
  }
`
;